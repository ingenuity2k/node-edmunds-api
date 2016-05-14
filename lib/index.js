
/* ~ Deps ~ */

var request = require('superagent');
var extend = require('underscore').extend;
var definitions = require('./definitions');

/**
 * The client constructor
 *
 * @param config - configuration object
 * @constructor
 */
function EdmundsClient(config) {
  if (!(this instanceof EdmundsClient)) {
    return new EdmundsClient(config);
  }

  var defaultConfig = {};
  defaultConfig.responseFormat = 'json';
  defaultConfig.baseUrl = 'https://api.edmunds.com';

  this.config = extend(defaultConfig, config);

  if (!this.config.apiKey) {
    throw new Error('API key must be provided');
  }
}

/**
 * Generic handler for API client method
 */
function addDefinition(defName) {
  var definition = definitions[defName];
  return function(params, done) {
    if (!done && typeof params === 'function') {
      done = params;
      params = {};
    }

    var url = this.config.baseUrl + definition.url;
    var xtraParams = {};
    xtraParams.fmt = this.config.responseFormat;
    xtraParams.api_key = this.config.apiKey;

    try {
      Object.keys(definition.params).forEach(function(paramName) {
        var paramDef = definition.params[paramName];
        if (!params[paramName]) {
          if (paramDef.required) {
            throw new Error('Parameter ' + paramName + ' is required');
          } else {
            return;
          }
        }
        if (paramDef.location === 'url') {
          url = url.replace(new RegExp('{' + paramName + '}', 'g'), params[paramName]);
        } else if (paramDef.location === 'querystring') {
          xtraParams[paramName] = params[paramName];
        }
      });
    } catch (e) {
      return done(e);
    }

    return request
      .get(url)
      .query(xtraParams)
      .end(function onEnd(err, res) {
        return done(err, res.body);
      });
  };
}

/* Add prototype methods */

EdmundsClient.prototype.getAllCarDetails = addDefinition('getAllCarDetails');
EdmundsClient.prototype.getCarImage = addDefinition('getCarImage');
EdmundsClient.prototype.getMakeDetails = addDefinition('getMakeDetails');


module.exports = EdmundsClient;
