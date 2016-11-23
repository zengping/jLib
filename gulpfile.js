var gulp       = require('gulp');
var livereload = require('gulp-livereload'), // 网页自动刷新（服务器控制客户端同步刷新）
  webserver = require('gulp-webserver'); // 本地服务器

// 注册任务
gulp.task('webserver', function() {
  gulp.src( 'app/' ) // 服务器目录（./代表根目录）
  .pipe(webserver({ // 运行gulp-webserver
    livereload: true, // 启用LiveReload
    open: true // 服务器启动时自动打开网页
  }));
});

// 监听任务
gulp.task('watch',function(){
  //gulp.watch( '*.html', ['html']) // 监听根目录下所有.html文件
  gulp.watch('app/**/*.js',['reload']);
  gulp.watch('app/**/*.html',['reload']);
  gulp.watch('app/**/*.css',['reload']);
});


gulp.task('reload', function(){
  gulp.src('')
  .pipe(livereload());
})

// 默认任务
gulp.task('default',['webserver','watch']);