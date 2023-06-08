/** 校验邮箱 */
export function checkEmail(email: string) {
    return email.match(/^[\w.%+-]+@[\w.]+\.[a-zA-Z]{2,}$/)
}