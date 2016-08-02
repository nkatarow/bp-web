var gulp = require ('gulp'),
		sass = require('gulp-ruby-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCSS = require('gulp-clean-css'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		concat = require('gulp-concat'),
		merge = require('merge-stream'),
		del = require('del'),
		plumber = require('gulp-plumber');
		livereload = require('gulp-livereload');

function onError(err) {
	console.log(err);
}

// Concat/autoprefix CSS
gulp.task('styles', function(){
	return sass('_ui/css/main.scss', { style: 'expanded'})
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 9', 'ios 6', 'android 4', '> 1%']}))
		.pipe(gulp.dest('_ui/compiled'))
		.pipe(plumber({errorHandler: onError}))
		.pipe(livereload());
});

// Concat JS
gulp.task('scripts', function(){
	var header = gulp.src('_ui/js/header-scripts/*.js')
		.pipe(concat('header-scripts.js'))
		.pipe(gulp.dest('_ui/compiled'))
		.pipe(plumber({errorHandler: onError}));

	var footer = gulp.src(['_ui/js/app.main.js', '_ui/js/footer-scripts/*.js', '_ui/js/components/*.js'])
		.pipe(concat('footer-scripts.js'))
		.pipe(gulp.dest('_ui/compiled'))
		.pipe(plumber({errorHandler: onError}));

	return merge(header, footer);
});


// Minify / Uglify
gulp.task('minify', function(){
	return gulp.src('_ui/compiled/main.css')
		.pipe(cleanCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('_ui/dist'))
		.pipe(plumber({errorHandler: onError}));
});
gulp.task('uglify', function(){
	var header = gulp.src('_ui/compiled/header-scripts.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify(''))
		.pipe(gulp.dest('_ui/dist'))
		.pipe(plumber({errorHandler: onError}));

	var footer = gulp.src('_ui/compiled/footer-scripts.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify(''))
		.pipe(gulp.dest('_ui/dist'))
		.pipe(plumber({errorHandler: onError}));

	return merge(header, footer);
});


// Cleaners
gulp.task('cleancompiled', function(){
	return del(['_ui/compiled']);
});
gulp.task('cleandist', function(){
	return del(['_ui/dist']);
});


// Default task
gulp.task('default', ['cleancompiled'], function(){
	gulp.start('styles', 'scripts');
});

// Watch task
gulp.task('watch', function(){
	livereload.listen();

	gulp.watch('_ui/css/**/*.scss', ['styles']);
	gulp.watch('_ui/js/**/*.js', ['scripts']);
});

// Build task
gulp.task('build', ['cleandist'], function(){
	gulp.start('minify', 'uglify');
});
