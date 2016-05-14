
module.exports = {
  /**
   * Vehicle API
   */
  "getAllCarDetails": {
    "params": {
      "make": {
        "required": true,
        "location": "url"
      },
      "model": {
        "required": true,
        "location": "url"
      },
      "year": {
        "required": true,
        "location": "url"
      },
      "view": {
        "required": true,
        "location": "querystring"
      }
    },
    "url": "/api/vehicle/v2/{make}/{model}/{year}/styles"
  },
  "getCarImage": {
    "params": {
      "make": {
        "required": true,
        "location": "url"
      },
      "model": {
        "required": true,
        "location": "url"
      },
      "year": {
        "required": true,
        "location": "url"
      }
    },
    "url": "/api/media/v2/{make}/{model}/{year}/photos"
  }
};
