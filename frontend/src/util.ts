import { State, Val } from 'vanjs-core'

/**
 * State Group
 * @author iuroc
 */
export class SG<T = {
    [key: string]: State<any> | SG
}> {
    public constructor(private init: T) { }

    public get(key: keyof typeof this.init) {
        return this.init[key]
    }
    public obj(key: keyof typeof this.init) {
        return this.init[key]
    }
}

export const randStr = (length: number): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    const charsetLength = charset.length
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength)
        result += charset[randomIndex]
    }
    return result
}