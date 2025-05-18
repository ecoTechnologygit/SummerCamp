const axios = require('axios');
require('dotenv').config();

class GooglePlacesClient {
  constructor() {
    this.apiKey = "AIzaSyCDLjtN9hRTrk92-gs6Rbbzpp6XkXlTIf8";
    this.placesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
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
      const params = {
        key: this.apiKey,
        location: location,
        radius: radius,
        type: 'restaurant'
      };

      const response = await axios.get(this.placesUrl, { params });
      
      if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
        return response.data.results;
      } else {
        throw new Error(`Google Places API error: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
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
