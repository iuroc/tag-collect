import van, { State } from 'vanjs-core'

/**
 * State Group
 * @author iuroc
 */
export class SG<T> {
    public constructor(private init: T) { }

    public get<Key extends keyof T>(key: Key): T[Key] {
        return this.init[key]
    }
    public obj<Key extends keyof T>(key: Key) {
        return new SG(this.init[key])
    }
    public set<Key extends keyof T>(key: Key, value: T[Key]) {
        this.init[key] = value
    }
}

export const sgGlobal = new SG({
    hasLogin: van.state(false)
})