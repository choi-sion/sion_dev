var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var path = require('path');
var url = require('url');
var fs = require('fs');

var $ = gulpLoadPlugins();
var site = JSON.parse(fs.readFileSync('./package.json'));

var base = {
  src: 'src',
  convert: 'convert',
  data: 'data'
};

gulp.task('server', function() {
  $.connect.server({
    root: base.convert,
    port: process.env.npm_config_port || site.port,
    livereload: false,
    middleware: function(connect, opt) {
      return [
        function(req, res, next) {
          var reqUrlPathname = url.parse(req.url).pathname;
          var reqPathObj = path.parse(reqUrlPathname);

          if (req.method === 'GET' && reqPathObj.ext === '.html') {
            res.setHeader('Content-Type', 'text/html');
          }

          next();
        }
      ];
    }
  });
});

gulp.task('scripts', function() {
  var dir = 'scripts';

  return gulp
    .src(path.join(base.src, dir, '**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe(gulp.dest(path.join(base.convert, dir)));
});

gulp.task('styles', function() {
  var dir = 'styles';
  var opts = {
    scss: {
      outputStyle: 'expanded'
    },
    autoprefixer: {
      cascade: false
    }
  };

  return gulp
    .src(path.join(base.src, dir, '**/*.scss'))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
    .pipe($.sass(opts.scss).on('error', $.sass.logError))
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe(gulp.dest(path.join(base.convert, dir)));
});

gulp.task('images', function() {
  var dir = 'images';

  return gulp
    .src(path.join(base.src, dir, '**/*.{png,jpg,gif,jpeg}'))
    .pipe(gulp.dest(path.join(base.convert, dir)));
});

gulp.task('html', function() {
  var dir = 'views';
  var lintCfg = '.htmlhintrc';
  var opts = {
    frontMatter: {
      property: 'meta',
      remove: true
    },
    prettify: {
      end_with_newline: true,
      unformatted: true,
      preserve_newlines: false,
      extra_liners: []
    }
  };

  var generatePages = function(file) {
    var meta = file.meta;
    var dataPaths = meta.data;
    var dataPath;
    var contentData = {};
    var list = ['default'];

    if (meta.state !== undefined) {
      list = list.concat(Object.keys(meta.state));
      list = Array.from(new Set(list));
    }

    file.meta.idxData = {};
    file.meta.idxData.groupName = meta.indexGroup;

    var charset = meta.charset || 'utf-8';
    var isCustomEncode = charset.toLowerCase() !== 'utf-8';

    var basePath = path.resolve(file.cwd, base.src);
    var srcPath = file.path.replace(basePath, '');

    srcPath = srcPath
      .substr(0, srcPath.lastIndexOf('.'))
      .split(path.sep)
      .join('/');

    var token = srcPath.replace(/\//g, '-').slice(1);
    file.meta.idxData.pages = [];

    if (dataPaths) {
      if (!Array.isArray(dataPaths)) {
        dataPaths = [dataPaths];
      }
    } else {
      dataPaths = [];
    }

    for (var i = 0, len = dataPaths.length; i < len; i++) {
      dataPath = path.join(__dirname, dataPaths[i]);

      if (!fs.existsSync(dataPath)) {
        continue;
      }

      delete require.cache[require.resolve(dataPath)];
      contentData[path.parse(dataPath).name] = require(dataPath);
    }

    list.forEach(function(state) {
      var isDefault = state === 'default';

      file.meta.idxData.pages.push({
        href: srcPath + (isDefault ? '' : '.' + state) + '.html',
        text: (meta.state && meta.state[state]) ||  meta.title,
        token: token + (isDefault ? '' : '-' + state)
      });

      var listOpts = {
        src: {
          base: path.join(base.src, dir)
        },
        ejs: {
          root: path.join(__dirname, base.src, dir)
        },
        ejsSettings: {
          ext: (isDefault ? '' : '.' + state) + '.html'
        },
        convertEncoding: {
          to: charset
        }
      };

      var listData = {
        site: site,
        page: file.meta,
        data: contentData,
        state: state
      };

      gulp
        .src(file.path, listOpts.src)
        .pipe($.frontMatter(opts.frontMatter))
        .pipe($.ejs(listData, listOpts.ejs, listOpts.ejsSettings))
        .pipe($.prettify(opts.prettify))
        .pipe($.htmlhint(lintCfg))
        .pipe($.htmlhint.reporter())
        .pipe($.if(isCustomEncode, $.convertEncoding(listOpts.convertEncoding)))
        .pipe(gulp.dest(path.join(base.convert, dir)));
    });
  };

  var generateIndex = function(file) {
    var indexOpts = {
      ejs: {
        ext: '.html'
      },
      ejsSettings: {
        ext: '.html'
      }
    };

    gulp
      .src(path.join(base.src, 'index.ejs'))
      .pipe($.frontMatter(opts.frontMatter))
      .pipe($.data(function(_file) {
        var groups = _file.meta.groups;
        var idxData = {};
        var currMeta;
        var group;
        var pages;

        Object.keys(groups).forEach(function(group) {
          idxData[group] = {
            name: groups[group],
            pages: []
          };
        });

        for (var i = 0, len = file.meta.length; i < len; i++) {
          currMeta = file.meta[i];
          group = currMeta.indexGroup;

          if (group && group in groups) {
            pages = idxData[group].pages;
            idxData[group].pages = pages.concat(currMeta.idxData.pages);
          }
        }

        _file.meta.list = idxData;
        _file.meta.pkgInfo = site;

        return _file.meta;
      }))
      .pipe($.ejs(null, indexOpts.ejs, indexOpts.ejsSettings))
      .pipe($.prettify(opts.prettify))
      .pipe($.htmlhint(lintCfg))
      .pipe($.htmlhint.reporter())
      .pipe(gulp.dest(base.convert));
  };

  return gulp
    .src([
      path.join(base.src, dir, '**/*.html'),
      path.join(base.src, dir, '**/*.ejs'),
      path.join('!' + base.src, dir, '**/_*.ejs'),
      path.join('!' + base.src, dir, 'layouts/*.ejs')
    ])
    .pipe($.frontMatter(opts.frontMatter))
    .pipe($.data(generatePages))
    .pipe($.pluck('meta'))
    .pipe($.data(generateIndex));
});

gulp.task('data_texts', function() {
  var dir = 'texts';

  return gulp
    .src(path.join(base.data, dir, '**/*.json'))
    .pipe(gulp.dest(path.join(base.convert, base.data, dir)));
});

gulp.task('clean', function() {
  var opts = {
    src: {
      read: false
    },
    clean: {
      force: true
    }
  };


  return gulp
    .src(base.convert, opts.src)
    .pipe($.clean(opts.clean));
});

gulp.task('default', $.sequence('clean', [
  'html',
  'styles',
  'images',
  'scripts',
  'data_texts'
]));
