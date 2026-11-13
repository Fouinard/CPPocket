import { Directory, File, Paths } from 'expo-file-system'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

type LogListener = () => void

export default class Logger {
    private static directory = new Directory(Paths.document, 'logs')
    private static file = new File(Logger.directory, 'application.log')
    private static queue: Promise<void> = Promise.resolve()
    private static initialized = false
    private static listeners = new Set<LogListener>()


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


    static subscribe(listener: LogListener) {
        this.listeners.add(listener)
        return () => {
            this.listeners.delete(listener)
        }
    }

    private static notify() {
        this.listeners.forEach(listener => {
            try {
                listener()
            } catch (error) {
                console.error('Logger listener error:', error)
            }
        })
    }


    private static log(level: LogLevel, message: string, data?: unknown, debugOnly: boolean = false) {
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
        if (__DEV__ || debugOnly) return
        this.queue = this.queue.then(async () => {
            await this.init()
            await this.file.write(line, { append: true })
            this.notify()
        }).catch(error => {
            console.error('Logger write error:', error)
        })
    }

    static debug(message: string, data?: unknown, debugOnly?: boolean) {
        this.log('debug', message, data, debugOnly)
    }

    static info(message: string, data?: unknown, debugOnly?: boolean) {
        this.log('info', message, data, debugOnly)
    }

    static warn(message: string, data?: unknown, debugOnly?: boolean) {
        this.log('warn', message, data, debugOnly)
    }

    static error(message: string, error?: unknown, debugOnly?: boolean) {
        this.log('error', message, error, debugOnly)
    }

    static async flush() {
        await this.queue
    }

    static getFileUri() {
        return this.file.uri
    }

    static async getLogsContent() {
        await this.init()
        return await this.file.text()
    }

    static async deleteAllLogs() {
        await this.file.write('', { append: false })
        this.info('All logs deleted', null)
    }

    static getLogFileSize() {
        return this.file.size
    }
}