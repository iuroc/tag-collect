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