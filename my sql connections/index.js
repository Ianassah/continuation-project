const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static('public'));

// Fetch Products
app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Add to Cart
app.post('/add-to-cart', (req, res) => {
    const { product_id } = req.body;
    let sql = "SELECT * FROM cart WHERE product_id = ?";
    db.query(sql, [product_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            sql = "UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?";
            db.query(sql, [product_id], (err, result) => {
                if (err) throw err;
                res.send('Cart updated');
            });
        } else {
            sql = "INSERT INTO cart (product_id, quantity) VALUES (?, 1)";
            db.query(sql, [product_id], (err, result) => {
                if (err) throw err;
                res.send('Product added to cart');
            });
        }
    });
});

// Fetch Cart
app.get('/cart', (req, res) => {
    const sql = "SELECT cart.quantity, products.product_name, products.price FROM cart JOIN products ON cart.product_id = products.product_id";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
