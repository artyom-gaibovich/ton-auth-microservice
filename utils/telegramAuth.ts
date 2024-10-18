interface User {
    id?: string;
    username?: string;

    [key: string]: any;
}

interface ValidatedData {
    [key: string]: string;
}

interface ValidationResult {
    validatedData: ValidatedData | null;
    user: User;
    message: string;
}

export function validateTelegramWebAppData(telegramInitData: string): ValidationResult {
    const BOT_TOKEN = process.env.BOT_TOKEN

    let validate: ValidatedData | null = null;
    let user: User = {}
    let message = ''

    if (!BOT_TOKEN) {
        return {message: 'BOT_TOKEN is not set', validatedData: null, user: {}}
    }
    const initData = new URLSearchParams(telegramInitData)
    const hash = initData.get('hash')
    if (!hash) {
        return {message: 'Hash is missing from initData', validatedData: null, user: {}}
    }
    initData.delete('hash')
    const authData = initData.get('auth_data')
    if (!authData) {
        return {message: 'auth_data is missing from initData', validatedData: null, user: {}}
    }
    const authTimestamp = parseInt(authData, 10)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const timeDifference = currentTimestamp - authTimestamp
    const fiveMinutes = 5 * 60
    if (timeDifference > fiveMinutes) {
        return {message: 'Telegram data is older than 5 minutes', validatedData: null, user: {}}
    }

    const dataCheckString = Array.from(initData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()


}
