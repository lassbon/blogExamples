var path = require('path');
var _ = require('underscore');
var express = require('express');
var app = express();

// mount '.tmp' as '/public'
app.use('/public', express.static(path.resolve(__dirname, '../.tmp')));

// mount bower_components and node_modules on development mode
if(app.get('env') === 'development'){
  _({
    '../bower_components': '/bower_components',
    '../node_modules': '/node_modules'
  }).each(function(mountPoint, folder){
    app.use(mountPoint, express.static(path.resolve(__dirname, folder)));
  });
}

// the API will be handled by a different express app
app.use(require('./api/app')({ rootURL: '/api' }));

// this is our app (just render everything with the UI renderer
var UIRenderer = require('./ui_renderer');

var router = express.Router();

router.get('*', function(req, res){
  UIRenderer.render(req.url, function(err, content){
    if(err){
      if(err === 'ROUTE_NOT_FOUND'){
        return res.status(404).send('Not Found');
      }
      else {
        console.warn('Error trying to load component to string', err);
        return res.status(500).send('Internal Server Error');
      }
    }
    res.render(path.resolve(__dirname, 'layout.ejs'), { content: content });
  });
});

app.use('/', router);

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});