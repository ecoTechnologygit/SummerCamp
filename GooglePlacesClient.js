const axios = require('axios');
require('dotenv').config();

class GooglePlacesClient {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.placesUrl = 'https://places.googleapis.com/v1/places:searchNearby';
    this.geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }
  async addressToCoordinates(address) {
    try {
      const response = await axios.get(this.geocodeUrl, {
        params: {
          address: address,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return `${location.lat},${location.lng}`;
      } else {
        throw new Error(`Geocoding error: ${response.data.status} - ${response.data.error_message || 'Address not found'}`);
      }
    } catch (error) {
      console.error('Error geocoding address:', error.message);
      throw error;
    }
  }

  async findNearbyRestaurants(location, radius = 1000) {
    try {
      const [lat, lng] = location.split(',').map(coord => parseFloat(coord));
      
      const requestBody = {
        includedTypes: ["restaurant"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng
            },
            radius: radius
          }
        }
      };

      const response = await axios.post(this.placesUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating'
        }
      });
      
      if (response.data && response.data.places) {
        return response.data.places.map(place => ({
          name: place.displayName?.text || 'Unknown',
          vicinity: place.formattedAddress || 'No address',
          rating: place.rating || 0
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error finding nearby restaurants:', error.message);
      throw error;
    }
  }

  async findRestaurantsByAddress(address, radius = 1000) {
    try {
      const coordinates = await this.addressToCoordinates(address);
      return await this.findNearbyRestaurants(coordinates, radius);
    } catch (error) {
      console.error('Error finding restaurants by address:', error.message);
      throw error;
    }
  }
}

module.exports = new GooglePlacesClient();
