var gulp = require('gulp'),
    shell = require('gulp-shell'),
    mainBowerFiles = require('gulp-main-bower-files'),
    gulpFilter = require('gulp-filter'),
    rename = require('gulp-rename'),
    nw_builder = require('nw-builder'),
    sass = require('gulp-sass');

var platform;
if (process.platform === 'darwin') platform ='osx64'
else if (process.platform === 'win32') platform ='win'
else if (process.arch === 'ia32') platform ='linux32'
else if (process.arch === 'x64') platform = 'linux64'

var nw_version = '<%=nwVersion%>';

// Run project
gulp.task('run', ['bower', 'sass'], shell.task([
    'node node_modules/nw-builder/bin/nwbuild -r ./ -v '+nw_version+' -p '+platform+' --cacheDir "./cache"'
]));

gulp.task('build', ['bower', 'sass'], function(cb) {

    // Read package.json
    var package = require('./package.json')

    // Find out which modules to include
    var modules = []
    if (!!package.dependencies) {
        modules = Object.keys(package.dependencies)
            .filter(function(m) {
                return m != 'nodewebkit'
            })
            .map(function(m) {
                return './node_modules/' + m + '/**/*'
            });
    }

    // Which platforms should we build
    var platforms = []
    if (process.argv.indexOf('--win') > -1) platforms.push('win')
    if (process.argv.indexOf('--mac') > -1) platforms.push('osx64')
    if (process.argv.indexOf('--linux32') > -1) platforms.push('linux32')
    if (process.argv.indexOf('--linux64') > -1) platforms.push('linux64')

    // Build for All platforms
    if (process.argv.indexOf('--all') > -1) platforms = ['win', 'osx64', 'linux32', 'linux64']

    // If no platform where specified, determine current platform
    if (!platforms.length && platform != undefined)
        platforms.push(platform);
    

    // Initialize NodeWebkitBuilder
    var nw = new nw_builder({
        files: ['./package.json', './app/**/*'].concat(modules),
        cacheDir: './cache',
        varsion: nw_version,
        flavor: 'normal',
        platforms: platforms,
        macIcns: './app-icon.icns',
        winIco: './app-icon.ico',
        checkVersions: false
    })

    nw.on('log', function(msg) {
        // Ignore 'Zipping... messages
        if (msg.indexOf('Zipping') !== 0) console.log(msg);
    });

    // Build!
    nw.build(function(err) {

        if (!!err) {
            return console.error(err);
        }

        // Handle ffmpeg for Windows
        if (platforms.indexOf('win') > -1) {
            gulp.src('./deps/ffmpegsumo/win/*')
                .pipe(gulp.dest(
                    './build/' + package.name + '/win'
                ));
        }

        // Handle ffmpeg for Mac
        if (platforms.indexOf('osx64') > -1) {
            gulp.src('./deps/ffmpegsumo/osx/*')
                .pipe(gulp.dest(
                    './build/' + package.name + '/osx/node-webkit.app/Contents/Frameworks/node-webkit Framework.framework/Libraries'
                ));
        }

         // Handle ffmpeg for Linux32
        if (platforms.indexOf('linux32') > -1) {
            gulp.src('./deps/ffmpegsumo/linux32/*')
                .pipe(gulp.dest(
                    './build/' + package.name + '/linux32'
                ));
        }

        // Handle ffmpeg for Linux64
        if (platforms.indexOf('linux64') > -1) {
            gulp.src('./deps/ffmpegsumo/linux64/*')
                .pipe(gulp.dest(
                    './build/' + package.name + '/linux64'
                ));
        }

        cb(err);
    })
});

gulp.task('bower', function() {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    var cssFilter = gulpFilter('**/*.css', { restore: true });
    var fontFilter = gulpFilter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf'], { restore: true });

    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/*.min.*',
                        './dist/fonts/*.*'
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(rename({dirname: './_vendor'}))
        .pipe(gulp.dest('./app/js'))
        .pipe(filterJS.restore)
        .pipe(cssFilter)
        .pipe(rename({dirname: './_vendor/'}))
        .pipe(gulp.dest('./app/css'))
        .pipe(cssFilter.restore)
        .pipe(fontFilter)
        .pipe(rename({dirname: './_vendor/'}))
        .pipe(gulp.dest('./app/fonts'))
});

gulp.task('sass', function () {
  return gulp.src('./app/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('watch', function(){
    gulp.watch('./app/scss/**/*.scss', ['sass']);
});