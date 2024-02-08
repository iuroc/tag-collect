import van, { State } from 'vanjs-core'

/**
 * State Group
 * @author iuroc
 */
export class SG<T = {
    [key: string]: State<any> | SG
}> {
    public constructor(private init: T) { }

    public get<Key extends keyof T>(key: Key): T[Key] {
        return this.init[key]
    }
    public obj<Key extends keyof T>(key: Key): T[Key] {
        return this.init[key]
    }
}

const sgGlobal = new SG({
    hasLogin: van.state(false)
})

export default sgGlobal