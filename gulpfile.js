const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')


// Очистка папки dist
gulp.task('clean', async () => {
   del.sync('dist')
})


// Компилируем scss файлы в css
gulp.task('scss', () => {
   return gulp.src('app/style/scss/**/*.scss')
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 8 versions'],
         cascade: false
      }))
      .pipe(rename({
         basename: 'style',
         suffix: '.min'
      }))
      .pipe(gulp.dest('app/style/css'))
      .pipe(browserSync.reload({stream: true}))
})

gulp.task('cssPlugins', () => {
   return gulp.src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
   ])
      .pipe(concat('_libs.scss'))
      .pipe(gulp.dest('app/style/scss'))
      .pipe(browserSync.reload({stream: true}))
})

// Таск для всех .html файлов
gulp.task('html', () => {
   return gulp.src('app/**/*.html')
      .pipe(browserSync.reload({stream: true}))
})

// Таск для всех основных .js файлов
gulp.task('scripts', () => {
   return gulp.src('app/scripts/**/*.js')
      .pipe(browserSync.reload({stream: true}))
})

// Таск для файлов .js из библиотеки node_modules
gulp.task('js', () => {
   return gulp.src([
      /////////////////// путь к .js файлам из node_modules //////////////////
      'node_modules/slick-carousel/slick/slick.js',
   ])
      .pipe(concat('libs.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/scripts'))
      .pipe(browserSync.reload({stream: true}))
})

// watcher, наблюдающий за файлами, и запускающий таски компиляции в случае их изменения
gulp.task('watch', () => {
   gulp.watch('app/style/scss/**/*.scss', gulp.parallel('scss'))
   gulp.watch('app/**/*.html', gulp.parallel('html'))
   gulp.watch('app/scripts/**/*.js', gulp.parallel('scripts'))
})

// Static server
gulp.task('browser-sync', () => {
   browserSync.init({
      server: {
         baseDir: 'app/'
      }
   })
})

// Builder Task
gulp.task('build', async () => {
   await del.sync('dist')

   // buildHtml
   gulp.src('app/**/*.html')
      .pipe(gulp.dest('dist'))

   // buildCss
   gulp.src('app/style/css/**/*.css')
      .pipe(gulp.dest('dist/style'))

   // buildScripts
   gulp.src('app/scripts/**/*.js')
      .pipe(gulp.dest('dist/scripts'))

   // buildFonts
   gulp.src('app/assets/fonts/**/*.*')
      .pipe(gulp.dest('dist/assets/fonts'))

   // buildImg
   gulp.src('app/assets/pictures/**/*.*')
      .pipe(gulp.dest('dist/assets/pictures'))
})


// добавить 'js' после 'css', когда добавятся скрипты пакетов из node_module
gulp.task('default', gulp.parallel('cssPlugins', 'scss', 'js', 'scripts', 'browser-sync', 'watch'))