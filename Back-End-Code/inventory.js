const express = require('express');
const router = express.Router();
const masterPool = require('./master_db');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const moment = require('moment');



router.use(async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ error: 'No token provided. Please log in first.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.dbname = decoded.dbname; 

        const db = new pg.Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: req.dbname,  
        });

        req.db = db; 
        next(); 
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

router.post('/add-product', async (req, res) => {
    let { name, category, quantity, barcode, price, type, status,imageUrl } = req.body;
    console.log(req.body);

    quantity = parseInt(quantity);
    price = parseFloat(price);

    if (
        !name || typeof name !== 'string' ||
        !category || typeof category !== 'string' ||
        typeof quantity !== 'number' ||
        !barcode || typeof barcode !== 'string' ||
        typeof price !== 'number' ||
        !['Offline', 'Online', 'Hybrid'].includes(type) ||
        !['Active', 'Inactive'].includes(status)
    ) {
        return res.status(400).json({ error: 'Invalid product data' });
    }

    try {
   
        const existing = await req.db.query(
            'SELECT id FROM products WHERE barcode = $1',
            [barcode]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Product with this barcode already exists' });
        }

        const result = await req.db.query(
            `INSERT INTO products 
            (name, category, quantity, barcode, price, type, status,"imageUrl") 
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8) 
            RETURNING id, name, category, quantity, barcode, price, type, status, created_at`,
            [name, category, quantity, barcode, price, type, status,imageUrl]
        );

        return res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: result.rows[0],
        });
    } catch (error) {
        console.error("Database insertion error:", error);
        return res.status(500).json({ error: 'Failed to insert product' });
    }
});


router.put('/update-products', async (req, res) => { 
    let { id,name, category, quantity, barcode, price, type, status } = req.body;
    quantity = parseInt(quantity);
    price =parseFloat(price);
    console.log(req.body);
    if (
      !name || typeof name !== 'string' ||
      !category || typeof category !== 'string' ||
      typeof quantity !== 'number' ||
      !barcode || typeof barcode !== 'string' ||
      typeof price !== 'number' ||
      !['Offline', 'Online', 'Hybrid'].includes(type) ||
      !['Active', 'Inactive'].includes(status)
    ) {
      return res.status(400).json({ error: 'Invalid product data' });
    }
  
    const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  
    try {
      const result = await req.db.query(
        `UPDATE products
         SET name = $1, category = $2, quantity = $3, barcode = $4, price = $5, type = $6, status = $7, updated_at = $8
         WHERE id = $9
         RETURNING *`,
        [name, category, quantity, barcode, price, type, status, updatedAt, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ success: true, message: 'Product updated', product: result.rows[0] });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  

router.post('/delete-product', async (req, res) => {
    const { id } = req.body;

    try {
      const result = await req.db.query(
        'UPDATE products SET deleted = true WHERE id = $1 RETURNING *',
        [id]
      );
      

        if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product deleted', product: result.rows[0] });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});




router.get('/products', async (req, res) => {
    try {
      const result = await req.db.query('SELECT * FROM products WHERE deleted = false');
      res.status(200).json({ success: true, products: result.rows });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  

module.exports = router;