const express = require('express');
const router = express.Router();

router.get('/favourites', (req, res) => {
    res.render('favourites');
});

router.get('/search', (req, res) => {
    res.render('search');
});

module.exports = router;
