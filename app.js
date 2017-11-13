

const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const views = require('koa-views');
const staticCache  = require('koa-static-cache');
const bodyparser = require('koa-bodyparser');
const nunjucks = require('nunjucks');
const moment = require('moment');
const path = require('path');

const p = require('./package.json');
const config = require('./config')
const app = module.exports = new Koa();

// view setting
const viewPath = path.join(__dirname, config.viewPath);

const engineEnv = nunjucks.configure('views', {
  autoescape: false,
});

engineEnv.addFilter('time', function(input, format) {
  if (!input) {
    return "";
  }
  return moment(input).format(format || "YYYY-MM-DD HH:mm:ss");
});

engineEnv.addGlobal('rootPath', config.rootPath);
engineEnv.addGlobal('cdnPath', config.cdnPath);

const getAssetRoot = () => {
  if (config.cdnEnable && config.cdnPath) {
    let rootCdnPath = config.cdnPath + '/' + p.name + '/' + p.version;
    if (config.cdnPathPrefix) {
      rootCdnPath = '/' + config.cdnPathPrefix;
    }

    return rootCdnPath
  } else {
    return config.rootPath;
  }
}

//get single file path, like server for img
engineEnv.addGlobal("asset", function(url) {
  return getAssetRoot() + url;
})
engineEnv.addGlobal('style', function() {
  let urls = Array.prototype.slice.call(arguments);
  let result = [];
  urls.forEach(function(url) {
    url = getAssetRoot() + url;
    result.push(`<link rel="stylesheet" href="${url}"></link>`);
  });

  return new nunjucks.runtime.SafeString(result.join('\n'))
});
engineEnv.addGlobal('script', function() {
  let urls = Array.prototype.slice.call(arguments)
  let result = [];
  urls.forEach(function(url) {
    let scriptPath = getAssetRoot() + url;
    result.push(`<script src="${scriptPath}"></script>`)
  });

  return result.join('\n');
})

app.use(views(viewPath, {map: { html: 'nunjucks' }}));

app.use(bodyparser());
app.use(logger());
app.use(koaBody());
app.use(require('koa-static')(__dirname + `/${config.static}`));
// app.use(staticCache(config.static));

// router
require('./routes')(app);

if (!!module.parent) app.callback();
app.listen(config.port, () => {
  console.log('koa app was launched at port:', config.port)
});