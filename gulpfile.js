const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const rename = require('gulp-rename')


// Компилируем scss файлы в css
gulp.task('scss', function () {
   return gulp.src('app/style/scss/**/*.scss')
      .pipe(sass({outputStyle: 'expanded'}))
      .pipe(gulp.dest('app/style/css'))
      .pipe(browserSync.reload({stream: true}))
})

gulp.task('css', function () {
   return gulp.src('app/style/scss/**/*.scss')
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(rename({
         basename: 'style',
         suffix: '.min'
      }))
      .pipe(gulp.dest('app/style/css'))
      .pipe(browserSync.reload({stream: true}))
})

// Таск для всех .html файлов
gulp.task('html', function () {
   return gulp.src('app/**/*.html')
      .pipe(browserSync.reload({stream: true}))
})

// Таск для всех основных .js файлов
gulp.task('scripts', function () {
   return gulp.src('app/scripts/**/*.js')
      .pipe(browserSync.reload({stream: true}))
})

// Таск для файлов .js из библиотеки node_modules
gulp.task('js', function () {
   return gulp.src([
      /////////////////// путь к .js файлам из node_modules //////////////////
   ])
      .pipe(concat('libs.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/scripts'))
      .pipe(browserSync.reload({stream: true}))
})

// watcher, наблюдающий за файлами, и запускающий таски компиляции в случае их изменения
gulp.task('watch', function () {
   gulp.watch('app/style/scss/**/*.scss', gulp.parallel('scss', 'css'))
   gulp.watch('app/**/*.html', gulp.parallel('html'))
   gulp.watch('app/scripts/**/*.js', gulp.parallel('scripts'))
})

// Static server
gulp.task('browser-sync', function () {
   browserSync.init({
      server: {
         baseDir: 'app/'
      }
   })
})

// добавить 'js' после 'css', когда добавятся скрипты пакетов из node_module
gulp.task('default', gulp.parallel('css', 'scripts', 'browser-sync', 'watch'))