var path = require('path');
var fs = require('fs');
var os = require('os');
var express = require('express');
var app = express();
var glob = require('glob');
var ejs = require('ejs');
var matter = require('gray-matter');
var mime = require('mime-types');
var sassMiddleware = require('node-sass-middleware');
var beautify = require('js-beautify');
var autoprefixer = require('autoprefixer');
var postcssMiddleware = require('postcss-middleware');
var ejsFilters = require('./config/filters');

global.site = require('./package.json');
global.src = path.join(__dirname, site.base.src);
global.dist = path.join(__dirname, site.base.dist);
var banner = require('./config/banner')(site, 'dev');

app.set('port', process.env.npm_config_port || site.port);

app.get('/', function(req, res, next) {
  var indexPath = path.join(src, 'index.ejs');
  var indexFm = matter.read(indexPath);
  var content = indexFm.content;
  var indexGroup = indexFm.data.groups;
  var groupsProps = Object.keys(indexGroup);

  var ejsOption = {
    root: src
  };

  var viewFIles = glob.sync('views/pages/**/[^_]*.ejs', {
    cwd: src
  });

  var data = {
    pkgInfo: site,
    list: groupsProps.reduce(function(obj, group) {
      obj[group] = {
        name: indexGroup[group],
        pages: []
      };

      return obj;
    }, {})
  };

  viewFIles.forEach(function(filePath) {
    var pathObj = path.parse(filePath);
    var srcPath = '/' + pathObj.dir + '/' + pathObj.name;
    var fileFullPath = path.join(src, filePath);
    var fileFm = matter.read(fileFullPath);
    var fmData = fileFm.data;
    var group = fmData.indexGroup;
    var states = fmData.state || {
      'default': fmData.title
    };

    if (!group || !group in data.list) {
      return;
    }

    var token = filePath
      .replace(/\.ejs$/i, '')
      .replace(/\//g, '-');

    var pages = Object.keys(states).reduce(function(before, state) {
      var isDefault = state === 'default';

      return before.concat({
        text: states[state],
        token: token + (isDefault ? '' : '-' + state),
        href: srcPath + (isDefault ? '' : '.' + state) + '.html'
      });
    }, []);

    data.list[group].pages = data.list[group].pages.concat(pages);

    if (data.list[group].pages.length > 1) {
      data.list[group].pages.sort(function(a, b) {
        return a.text === b.text ? 0 : a.text < b.text ? -1 : 1;
      });
    }
  });

  res.end(ejs.render(content, data, ejsOption));
});

app.get('/views/*/?*.html', function(req, res, next) {
  var pathObj = path.parse(req.path);
  var fileState = pathObj.name.split('.');
  var targetFile = fileState[0];
  var targetPath = path.join(src, pathObj.dir, targetFile + '.ejs');
  var ejsOption = {
    root: path.join(src, 'views')
  };

  fs.readFile(targetPath, function(err, data) {
    var fm;
    var renderData;
    var htmlString;
    var beautified;

    if (err) {
      next();
    } else {
      fm = matter(data.toString());
      renderData = {
        page: fm.data,
        state: fileState[1] || 'default',
        site: site,
        $: ejsFilters(),
        data: {}
      };

      ejsOption.filename = targetPath;

      if (fm.data.data && Object.keys(fm.data.data).length) {
        fm.data.data.forEach(function(filePath) {
          var fileName = path.basename(filePath, '.json');
          var fileFullPath = path.join(__dirname, filePath);
          var parsedStr;

          if (fs.existsSync(fileFullPath)) {
            parsedStr = fs.readFileSync(fileFullPath);
            renderData.data[fileName] = JSON.parse(parsedStr);
          }
        });
      }

      res.set('Content-Type', 'text/html');
      htmlString = ejs.render(fm.content, renderData, ejsOption);
      beautified = beautify.html(htmlString, site.htmlBeautify);
      res.end(beautified);
    }
  });
});

app.get('/data/**/*/?*', function(req, res, next) {
  var targetPath = path.join(__dirname, req.path);
  var mimeType = mime.contentType(targetPath);

  fs.readFile(targetPath, function(err, data) {
    if (err) {
      next();
    } else {
      res.set('Content-Type', mimeType);
      res.send(data);
    }
  });
});

app.use(sassMiddleware({
  src: path.join(src, 'styles'),
  dest: path.join(dist, 'styles'),
  prefix: '/styles',
  outputStyle: 'expanded',
  force: true,
  response: false,
  maxAge: 0,
  sourceMapContents: true,
  sourceMapEmbed: true,
  includePaths: [
    path.join(src, 'styles')
  ]
}));

app.use('/styles', postcssMiddleware({
  plugins: [
    autoprefixer({
      remove: false,
      cascade: false
    }),
    function(root, result) {
      var first = root.first;
      var hasCharset = first.type === 'atrule' && first.name === 'charset';
      var cssBanner = '/*!' + banner + '*/';

      if (hasCharset) {
        root.first.after('\n' + cssBanner);
      } else {
        root.prepend(cssBanner);
      }
    }
  ],
  options: {
    map: {
      inline: true
    }
  },
  src: function(req) {
    return path.join(dist, 'styles', req.url);
  }
}));

app.use('/scripts', express.static(path.join(src, 'scripts')));
app.use('/images', express.static(path.join(src, 'images')));
app.use('/styles', express.static(path.join(dist, 'styles')));

app.listen(app.get('port'), function() {
  var ifaces = os.networkInterfaces();
  var ip;

  Object.keys(ifaces).forEach(function(dev) {
    ifaces[dev].filter(function(details) {
      if (details.family === 'IPv4' && details.internal === false) {
        ip = details.address;
      }
    });
  });

  console.info('server started http://' + ip + ':' + app.get('port'));
});
