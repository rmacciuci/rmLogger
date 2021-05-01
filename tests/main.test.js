const { Log } = require("../src/Log");
const fs = require('fs');

const FILES_PATH = {
    mainpath: '/Users/rm/Projects/rmLogger/logs'
}

// Verificamos la creacion de directorio
it('Creación del directorio', () => {

    new Log(FILES_PATH);
    
    // Comprobamos que se haya creado la carpeta contenedora
    let existFolder = fs.existsSync(FILES_PATH.mainpath);

    expect(existFolder).toBe(true);
});

it('Creacion de registros en un archivo', () => {
    const log = new Log(FILES_PATH);

    // generamos un log en cada archivo
    let mensajePrueba = 'Nuevo mensaje de error'
    log.error(mensajePrueba);

    // Buscamos que el resultado se haya grabado en el archivo de error y en el archivo principal

    // Obtenemos los nombres de cada archivo
    let error_file = log.error_log,
        main_file  = log.main_log;

    // Abrimos el primer archivo
    let f1 = fs.readFileSync(error_file, { encoding: 'utf-8' });
    f1 = f1.split('\n').filter(v => !!v)

    let f2 = fs.readFileSync(main_file, { encoding: 'utf-8' });
    f2 = f2.split('\n').filter(v => !!v)
    
    // obtenemos el ultimo valor
    let lastValue = f1[f1.length - 1];
    let lastValueMain = f2[f2.length - 1];

    expect(lastValue).toMatch(mensajePrueba);
    expect(lastValueMain).toMatch(mensajePrueba);
    expect(lastValueMain).not.toMatch(lastValue);

    expect(lastValueMain).toMatch(/(error)/)
    // El ultimo valor debe ser igual al ultimo valor del log principal
})
