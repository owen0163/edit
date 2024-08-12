const express = require('express');
const cors = require('cors');
const pool = require('./connect'); 
const bodyParser = require('body-parser');
//////////////////
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');


const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
///////////////////
const secret = 'your_jwt_secret'; // Replace with your actual JWT secret
// Start server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Routes
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).json({ error: err.message });
  }
});
module.exports = app;
///update
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const product = Array.isArray(req.body) ? req.body[0] : req.body;

  // console.log('Incoming request body:', product);

  // Validate input
  if (
    !product.name || 
    product.defaultprice == null ||
    product.currentprice == null ||
    product.stock == null ||
    product.maxstock == null ||
    !product.image
  ) {
    return res.status(400).send('All fields are required');
  }

  const updateQuery = `
      UPDATE products
      SET name = $1,
          defaultprice = $2,
          currentprice = $3,
          stock = $4,
          maxstock = $5,
          image = $6
      WHERE id = $7
  `;

  try {
    const result = await pool.query(updateQuery, [
      product.name,
      product.defaultprice,
      product.currentprice,
      product.stock,
      product.maxstock,
      product.image,
      productId
    ]);

    if (result.rowCount === 0) {
      return res.status(404).send('Product not found');
    }

    res.send('Update was successful');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('An error occurred while updating the product');
  }
});

module.exports = app;




////////////////////////////////////////////////////
app.post('/products', async (req, res) => {
  const { name, defaultprice, currentprice, stock, maxstock, image } = req.body;

  // Validate the required fields
  if (!name || defaultprice === undefined || currentprice === undefined || stock === undefined || maxstock === undefined) {
    return res.status(400).json({ error: 'Name, defaultprice, currentprice, stock, and maxstock are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, defaultprice, currentprice, stock, maxstock, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, defaultprice, currentprice, stock, maxstock, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;

///////////////////////////////////////

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
/////////////////////////////////////////////////////////////////
/////// register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate the required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
////////////////////////////////////////////////////////
////// login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query to fetch the user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      res.status(400).json({
        message: 'login fail(wrong email, pass)'
       })
       return false
    }
    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is incorrect, return an error
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

    // Return the token to the client
    res.json({ 
      message: 'success ',token
     });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
////////////////////////////////////
app.get('/users', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let authToken = '';

    if (authHeader) {
      authToken = authHeader.split(' ')[1]; // Correctly split by space
    }

    console.log("authToken:", authToken);

    if (!authToken) {
      return res.status(403).json({ message: 'Token not provided' });
    }

    try {
      const user = jwt.verify(authToken, secret); // Verifying the JWT
      console.log('user:', user);

      const result = await pool.query('SELECT * FROM users');
      res.json(result.rows);
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ 
        message: 'Authentication failed. Invalid token.'
      });
    }
  } catch (err) {
    console.error('error:', err);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = app;