let project = "dist";
let sourse = "src";

let path = {
	build: {
		html: project + "/",
		css: project + "/css/", 
		js: project + "/js/",
		img: project + "/img/",
		fonts: project + "/fonts/",
	},
	src: {
		html: [sourse + "/*.html", "!" + sourse + "/_*.html"],
		css: sourse + "/scss/style.scss",
		js: sourse + "/js/*.js",
		img: sourse + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
		fonts: sourse + "/fonts/**/*",
	},
	watch: {
		html: sourse + "/**/*.html",
		css: sourse + "/scss/**/*.{scss,css}",
		js: sourse + "/js/**/*.js",
		img: sourse + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
	},
	clean: "./" + project + "/",
};

let {
	src,
	dest
} = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	gcmq = require("gulp-group-css-media-queries"),
	cleanCSS = require("gulp-clean-css"),
	rename = require("gulp-rename"),
	imagemin = require("gulp-imagemin"),
	webp = require("gulp-webp"),
	webpHTML = require("gulp-webp-html"),
	webpcss = require("gulp-webpcss");



function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project + "/",
		},
		port: 3000,
		notify: false,
	});
}

function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webpHTML())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expended",
			})
		)
		.pipe(gcmq())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 version"],
				cascade: true,
			})
		)
		.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(
			rename({
				extname: ".min.css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js).pipe(dest(path.build.js)).pipe(browsersync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{
					removeViewBox: false,
				}, ],
				interlaced: true,
				optimizationLevel: 3,
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}

function fonts() {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
}


function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;