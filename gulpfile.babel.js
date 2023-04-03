const appDirectory = './cookie-banner/common/components/imported';
const assetsDirectory = './cookie-banner/public';
const stylesheetsDirectory = `${assetsDirectory}/stylesheets`;

import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';

const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'assets/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'assets/scripts/'
  }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function copyCookieBanner(done) {
  gulp.src(['./node_modules/cmc-cookies-manager/shared-component/components/cookie-manager/**/*.js'])
    .pipe(gulp.dest(`${assetsDirectory}/js/`));

  gulp.src(['./node_modules/cmc-cookies-manager/shared-component/components/cookie-manager/**/*.njk'])
    .pipe(gulp.dest(`${appDirectory}/cookie-manager/`));

  gulp.src(['./node_modules/cmc-cookies-manager/shared-component/components/button/**/*.*'])
    .pipe(gulp.dest(`${appDirectory}/button/`));

  gulp.src(['./node_modules/cmc-cookies-manager/shared-component/components/styles/**/*.css'])
    .pipe(gulp.dest(`${stylesheetsDirectory}/`));

  gulp.src(['./node_modules/cmc-cookies-manager/shared-component/components/cookie-banner/**/*.*'])
    .pipe(gulp.dest(`${appDirectory}/cookie-banner/`));

  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/govuk_template_jinja/assets/javascripts/**/*.js'
  ])
    .pipe(gulp.dest(`${assetsDirectory}/js/lib/`));
  done();
}

exports.default = copyCookieBanner;

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts));
/*
 * Export a default task
 */
export default build;