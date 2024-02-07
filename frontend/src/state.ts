import van, { State } from 'vanjs-core'

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

const sgGlobal = new SG<{
    /** 是否登录 */
    hasLogin: State<boolean>
}>({
    hasLogin: van.state(false)
})

export default sgGlobal