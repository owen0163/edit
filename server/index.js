const express = require('express');
const cors = require('cors');
const pool = require('./connect'); 
const bodyParser = require('body-parser');
const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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