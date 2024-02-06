import { State } from 'vanjs-core'

/** State Group */
class StateGroup {
    public constructor(private init: {
        [key: string]: State<any> | SG
    }) { }

    public get<T = any>(key: string) {
        return this.init[key] as State<T>
    }
    public obj(key: string) {
        return this.init[key] as SG
    }
}

export class SG extends StateGroup { }


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