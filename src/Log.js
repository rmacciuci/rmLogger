const fs = require('fs');

class Log {
    error_log    = null;
    main_log     = null;
    access_log   = null;
    warn_log     = null;
    mainpath     = null;

    constructor({ error, main, access, warn, mainpath }) {
        this.mainpath      = mainpath  || null;
        this.error_log     = error     || 'error.log';
        this.main_log      = main      || 'main.log';
        this.access_log    = access    || 'access.log';
        this.warn_log      = warn      || 'warn.log';

        this.check_folder();
        return this.create_files();
    }

    check_folder(){
        // Consultamos si existe la ruta brindada
        try {
            if(!fs.existsSync(this.mainpath)) {
                fs.mkdirSync(this.mainpath, '0775');
            }

            this.error_log     = `${this.mainpath}/${this.error_log}`;
            this.main_log      = `${this.mainpath}/${this.main_log}`;
            this.access_log    = `${this.mainpath}/${this.access_log}`;
            this.warn_log      = `${this.mainpath}/${this.warn_log}`;

        } catch (e) {
            throw e;
        }

    }

    create_files() {
        this.files = {};
        this.files.error = fs.createWriteStream(this.error_log, { flags: 'w' });
        this.files.warn = fs.createWriteStream(this.warn_log, { flags: 'w' });
        this.files.access = fs.createWriteStream(this.access_log, { flags: 'w' });
        this.files.main = fs.createWriteStream(this.main_log, { flags: 'w' });

        if(fs.existsSync(this.error_log)){
            this.files.error.write(fs.readFileSync(this.error_log, { encoding: 'utf-8' }))
        }

        if(fs.existsSync(this.warn_log)){
            this.files.warn.write(fs.readFileSync(this.warn_log, { encoding: 'utf-8' }))
        }

        if(fs.existsSync(this.access_log)){
            this.files.access.write(fs.readFileSync(this.access_log, { encoding: 'utf-8' }))
        }

        if(fs.existsSync(this.main_log)){
            this.files.main.write(fs.readFileSync(this.main_log, { encoding: 'utf-8' }))
        }
        

        return this;
    }

    static get_message_schema(message, type = null) {
        return `[${new Date()}]${type ? `(${type})` : ""} ${message}\n`; 
    }
    
    access(message) {
        this.files.access.write(Log.get_message_schema(message));
        this.main(message, 'access')
    }

    main(message, type = null) {
        this.files.main.write(Log.get_message_schema(message,type));
    }

    error(message) {
        this.files.error.write(Log.get_message_schema(message));
        this.main(message, 'error')
    }

    warn(message) {
        this.files.warn.write(Log.get_message_schema(message));
        this.main(message, 'warn')
    }
}

module.exports.Log = Log