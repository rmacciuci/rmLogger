const fs = require('fs');

class Log {
    #error_log    = null;
    #main_log     = null;
    #access_log   = null;
    #warn_log     = null;

    constructor({ error, main, access, warn }) {
        this.#error_log     = error || null;
        this.#main_log      = main || null;
        this.#access_log    = access || null;
        this.#warn_log      = warn || null;
        return this.create_files();
    }

    create_files() {
        this.files = {}

        if(this.#error_log) {
            this.files.error = fs.createWriteStream(this.#error_log, { flags: 'w' });
        }
        if(this.#warn_log) {
            this.files.warn = fs.createWriteStream(this.#warn_log, { flags: 'w' });
        }
        if(this.#access_log) {
            this.files.access = fs.createWriteStream(this.#access_log, { flags: 'w' });
        }
        if(this.#main_log) {
            this.files.main = fs.createWriteStream(this.#main_log, { flags: 'w' });
        }
        return this;
    }

    static get_message_schema(message, type = null) {
        return `[${new Date()}]${type ? `(${type})` : ""} ${message}\n`; 
    }
    
    access(message) {
        if(!this.#access_log) return;
        this.files.access.write(Log.get_message_schema(message));
        this.main(message, 'access')
    }

    main(message, type = null) {
        if(!this.#main_log) return;
        this.files.main.write(Log.get_message_schema(message,type));
    }

    error(message) {
        if(!this.#error_log) return;
        this.files.error.write(Log.get_message_schema(message));
        this.main(message, 'error')
    }

    warn(message) {
        if(!this.#warn_log) return;
        this.files.warn.write(Log.get_message_schema(message));
        this.main(message, 'warn')
    }
}

module.exports.Log = Log