'use strict'

const Router = require('koa-router');
const router = new Router();

const demo = require('./demo');

module.exports = function(app) {
  demo(router);

  return app.use(router.routes())
}