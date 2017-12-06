'use strict'

module.exports = function(app) {

  app.get('/koa2', async (ctx, next) => {
    await ctx.render('./app/index.html', {
      title: 'css-center-example',
      content: "Hello Koa 2",
    })
  })
}