'use strict'

module.exports = function(options) {
  options = options || {};
  
  return async function (ctx, next) {
    if (options.type !== 'markdown') {
      return await next();
    } else {
      
    }
  }
}