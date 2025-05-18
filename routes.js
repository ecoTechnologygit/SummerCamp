const express = require('express');
const router = express.Router();
const googlePlacesClient = require('./GooglePlacesClient');
const mongoClient = require('./MongoClient');

router.get('/favourites', async (req, res) => {
    try {
        const favourites = await mongoClient.getAllFavourites();
        res.render('favourites', { favourites });
    } catch (error) {
        console.error('Error fetching favourites:', error);
        res.status(500).render('favourites', { 
            favourites: [],
            error: 'Failed to fetch favourites'
        });
    }
});

router.post('/favourites/add', async (req, res) => {
    try {
        const { name, vicinity, rating } = req.body;
        
        const restaurant = {
            name,
            vicinity,
            rating: parseFloat(rating) || 0,
            dateAdded: new Date()
        };
        
        await mongoClient.addFavourite(restaurant);
        
        res.redirect('/favourites');
    } catch (error) {
        console.error('Error adding to favourites:', error);
        res.status(500).send('Failed to add restaurant to favourites');
    }
});

router.get('/search', (req, res) => {
    res.render('search');
});

router.post('/search', async (req, res) => {
    try {
        const { address, radius } = req.body;
        
        if (!address) {
            return res.render('search', { 
                error: 'Address is required'
            });
        }
        const restaurants = await googlePlacesClient.findRestaurantsByAddress(
            address, 
            radius ? parseInt(radius) : 1000
        );
        
        res.render('search', { 
            restaurants,
            searchParams: { address, radius }
        });
    } catch (error) {
        console.error('Error searching restaurants:', error);
        res.render('search', { 
            error: 'Failed to search restaurants: ' + error.message
        });
    }
});

module.exports = router;
