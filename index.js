const { Log } = require("./src/Log");

function Main(files_object) {
    if(!files_object) throw new Error("Log files not defined");

    // Generate a log object and init this in logger var.
    logger = new Log(files_object);
    return true;
}   

module.exports = Main;