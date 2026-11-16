import { getAppDeviceInfo } from '@/shared/utils/getAppDeviceInfo'
import { Directory, File, Paths } from 'expo-file-system'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

type LogListener = () => void

const LOG_FILE_REGEX = /^application.*\.log$/

export default class Logger {
    private static directory = new Directory(Paths.document, 'logs')
    private static queue: Promise<void> = Promise.resolve()
    private static readyDay: string | null = null
    private static listeners = new Set<LogListener>()

    private static getDayKey() {
        const now = new Date()
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
    }

    private static getFile() {
        return new File(this.directory, `application-${this.getDayKey()}.log`)
    }

    private static ensureReady() {
        const day = this.getDayKey()
        if (this.readyDay === day) return

        if (!this.directory.exists) {
            this.directory.create({ intermediates: true })
        }

        const file = this.getFile()
        if (!file.exists) {
            file.create()
        }

        try {
            for (const item of this.directory.list()) {
                if (item instanceof File && item.name !== file.name && LOG_FILE_REGEX.test(item.name)) {
                    item.delete()
                }
            }
        } catch (error) {
            console.error('Logger purge error:', error)
        }

        this.readyDay = day
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
            this.ensureReady()
            await this.getFile().write(line, { append: true })
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
        this.ensureReady()
        return this.getFile().uri
    }

    static async getLogsContent() {
        this.ensureReady()
        return await this.getFile().text()
    }

    static async deleteAllLogs() {
        this.ensureReady()
        await this.getFile().write('', { append: false })
        this.info('All logs deleted', null)
    }

    static getLogFileSize() {
        this.ensureReady()
        return this.getFile().size
    }

    static logAppDeviceInfo() {
        const deviceInfo = getAppDeviceInfo()
        this.info('\n\nApp device info : ', deviceInfo)
    }
}