import debug from 'debug';

// Configurando namespaces de debug
export const debugServer = debug('api:server');
export const debugAuth = debug('api:auth');
export const debugDB = debug('api:database');
export const debugRoutes = debug('api:routes');
export const debugError = debug('api:error');

// Utilitário para logging estruturado
export class Logger {
    static info(namespace: string, message: string, data?: any) {
        const log = debug(`api:${namespace}:info`);
        log(message, data ? JSON.stringify(data, null, 2) : '');
    }

    static error(namespace: string, message: string, error?: any) {
        const log = debug(`api:${namespace}:error`);
        log(message, error?.stack || error);
    }

    static warn(namespace: string, message: string, data?: any) {
        const log = debug(`api:${namespace}:warn`);
        log(message, data ? JSON.stringify(data, null, 2) : '');
    }

    static debug(namespace: string, message: string, data?: any) {
        const log = debug(`api:${namespace}:debug`);
        log(message, data ? JSON.stringify(data, null, 2) : '');
    }
}

// Configurações de debug para desenvolvimento
if (process.env.NODE_ENV === 'development') {
    debug.enabled = (name: string) => {
        return name.startsWith('api:');
    };
}
