import fs from 'fs';
import fonter from 'gulp-fonter-unx';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "FONTS",
                message: "Error: <%= error.message %>"
        })
        ))
        .pipe(fonter({
        formats: ['ttf']
        }))
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export const ttfToWoff = () => {
  // Шукаємо файли шрифтів .ttf
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.ttf`)
    .pipe(app.plugins.plumber(app.plugins.notify.onError({
      title: 'FONTS',
      message: "Error: <%= error.message %>"
    })))
    // конвертуємо в .woff
    .pipe(fonter({
      formats: ['woff']
    }))
    // Вивантауємо у папку з результатом
    .pipe(app.gulp.dest(`${app.path.build.fonts}`))
    // Шукаємо файли шрифтів .ttf
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    // конвертуємо в .woff2
    .pipe(ttf2woff2())
    // Вивантауємо у папку з результатом
    .pipe(app.gulp.dest(`${app.path.build.fonts}`));
};


export const fontStyle = () => { 
    // Файл стилів підключення шрифтів
    let fontsFile = `${app.path.srcFolder}/sass/fonts.sass`;
    // Перевіряємо існування файлів шрифтів
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            // Перевіряємо існування файлу стилів для підключення шрифтів
            if (!fs.existsSync(fontsFile)) {
                // Якщо файлу немає, створюємо його
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for (var i = 0; i < fontsFiles.length; i++) {
                    // Заисуємо підключення шрифтів у файл стилів
                    let fontFileName = fontsFiles[i].split('.')[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        if (fontWeight.toLowerCase() === 'thin') {
                            fontWeight = 100;
                        } else if (fontWeight.toLowerCase() === 'extralight') {
                            fontWeight = 200;
                        } else if (fontWeight.toLowerCase() === 'light') {
                            fontWeight = 300;
                        } else if (fontWeight.toLowerCase() === 'medium') {
                            fontWeight = 500;
                        } else if (fontWeight.toLowerCase() === 'semibold') {
                            fontWeight = 600;
                        } else if (fontWeight.toLowerCase() === 'bold') {
                            fontWeight = 700;
                        } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
                            fontWeight = 800;
                        } else if (fontWeight.toLowerCase() === 'black') {
                            fontWeight = 900;
                        } else {
                            fontWeight = 400;
                        }
                        fs.appendFile(fontsFile, `@font-face \n\tfont-family: ${fontName}\n\tfont-display: swap\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff")\n\tfont-weight: ${fontWeight}\n\tfont-style: normal\n\r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }
            } else {
                // Якщо файл існує, виводимо повідомлення
                console.log("Файл scss/fonts.sass вже існує. Для оновлення файлу його необхідно видалити")
            }
        }
    })
    
    return app.gulp.src(`${app.path.srcFolder}`)
    function cb() { }
    

}