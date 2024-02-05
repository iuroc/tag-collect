"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalIps = void 0;
const os_1 = require("os");
/**
 * 获取局域网 IP 地址
 * @param internal 是否包含内部地址
 * @returns IP 列表
 */
const getLocalIps = (internal = true) => {
    const infos = Object.values((0, os_1.networkInterfaces)());
    return infos.flat().filter(info => info.family == 'IPv4' && (internal ? true : !info.internal)).map(info => info.address);
};
exports.getLocalIps = getLocalIps;
