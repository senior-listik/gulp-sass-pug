// Основний модуль
import gulp from "gulp";
// Імпорт модулів
import { path } from "./gulp/config/path.js";
// іипорт загальних плагінів
import { plugins } from "./gulp/config/plugins.js";

// передаємо значення у глобальну змінну
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins
}

// імпорт задач
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
// import { scss } from "./gulp/tasks/scss.js";
import { compileSass } from "./gulp/tasks/sass.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontStyle } from "./gulp/tasks/fonts.js";
import { svgSprive } from "./gulp/tasks/svgSprive.js";
import { zip } from "./gulp/tasks/zip.js";
import { ftp } from "./gulp/tasks/ftp.js";

// спостерігач за змінами у файлах
function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    // gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.sass, compileSass);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);
}

export { svgSprive };

const fonts = gulp.series(otfToTtf, ttfToWoff, fontStyle);
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, compileSass, js, images));
// побудова сценарію виконання задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

// Експорт сценаріїв
export { dev };
export { build };
export { deployZIP };

// виконання сценарію за замовчуванням
gulp.task('default', dev);