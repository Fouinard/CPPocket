import { File, Directory, Paths } from 'expo-file-system'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export default class Logger {
    private static directory = new Directory(Paths.document, 'logs')
    private static file = new File(Logger.directory, 'application.log')
    private static queue: Promise<void> = Promise.resolve()
    private static initialized = false

    private static async init() {
        if (this.initialized) return
        if (!this.directory.exists) {
            this.directory.create({ intermediates: true })
        }
        if (!this.file.exists) {
            this.file.create()
        }
        this.initialized = true
    }

    private static log(level: LogLevel, message: string, data?: unknown) {
        const timestamp = new Date().toISOString()
        let serializedData = ''

        if (data != undefined) {
            try {
                serializedData = JSON.stringify(data)
            } catch {
                serializedData = String(data)
            }
        }
        const line = `[${timestamp}] [${level}] ${message}` + (serializedData ? ` | ${serializedData}` : '') + '\n'
        console.log(line)
        this.queue = this.queue.then(async () => {
            await this.init()
            await this.file.write(line, { append: true })
        }).catch(error => {
            console.error('Logger write error:', error)
        })
    }

    static debug(message: string, data?: unknown) {
        this.log('debug', message, data)
    }

    static info(message: string, data?: unknown) {
        this.log('info', message, data)
    }

    static warn(message: string, data?: unknown) {
        this.log('warn', message, data)
    }

    static error(message: string, error?: unknown) {
        this.log('error', message, error)
    }

    static async flush() {
        await this.queue
    }

    static getFileUri() {
        return this.file.uri
    }
}