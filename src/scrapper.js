const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.carteleraargentina.com.ar/cine/showcase-cordoba/';

class Scrapper {
  static getCinemaListing = async () => {
    try {
      const response = await axios.get(URL);
      const $ = cheerio.load(response.data);
      const movies = $('.has-text-align-center:not(:first)')
        .map((i, movie) => $(movie).text())
        .get();
      
      return movies;
  
    } catch(error) {
      console.error(error);
    }
  };
}

Scrapper.getCinemaListing();

module.exports = { Scrapper };
