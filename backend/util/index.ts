import { networkInterfaces } from 'os'

/**
 * 获取局域网 IP 地址
 * @param internal 是否包含内部地址
 * @returns IP 列表
 */
export const getLocalIps = (internal = true) => {
    const infos = Object.values(networkInterfaces())
    return infos.flat().filter(
        info => info.family == 'IPv4' && (internal ? true : !info.internal)
    ).map(info => info.address)
}
