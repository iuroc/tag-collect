/** 校验邮箱 */
export function checkEmail(email: string) {
    return email.match(/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
}

/** 校验 URL */
export function checkUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}