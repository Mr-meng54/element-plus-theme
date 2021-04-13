const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass");
const minifyCss = require("gulp-clean-css");
const renameCss = require("gulp-rename");
const merge = require("merge-stream");

gulp.task("clear-dist", function () {
  return del("dist");
});

function createGenerateSass(file, rename) {
  return gulp
    .src(file)
    .pipe(
      sass({
        includePaths: ["node_modules"],
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(minifyCss())
    .pipe(renameCss(rename))
    .pipe(gulp.dest("dist"));
}

gulp.task("sass-css", function () {
  try {
    const res = fs.readdirSync("./");
    const themes = [];
    res.forEach((i) => {
      if (/^element-variables-/gi.test(i)) {
        const arr = /^element-variables-(.+?).scss/gi.exec(i);
        themes.push(createGenerateSass(arr[0], arr[1] + ".css"));
      }
    });
    return merge(...themes);
  } catch (e) {
    console.error("获取文件失败！");
    console.error(e);
  }
  
});

gulp.task("move-font", function () {
  return gulp
    .src(["./node_modules/element-plus/lib/theme-chalk/fonts/**"])
    .pipe(gulp.dest("dist/fonts"));
});

gulp.task("default", gulp.series("clear-dist", "sass-css", "move-font"));
