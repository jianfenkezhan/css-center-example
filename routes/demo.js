'use strict'

module.exports = function(app) {

  app.get('/', async (ctx, next) => {
    await ctx.render('./app/index.html', {
      title: 'css-tricks',
      content: "Hello Koa 2",
    })
  })
}