"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.apiConfig = void 0;
/** API 接口配置 */
exports.apiConfig = {
    /** 网页标题获取，`=` 结尾，内置接口为 `/api/getTitle` */
    getTitle: 'https://get-html.9494666.xyz/?type=title&url=',
    /** 新增收藏 */
    add: '/api/add',
    /** 获取标签列表 */
    getTag: '/api/tagList'
};
/** 网站配置 */
exports.config = {
    /** API 接口配置 */
    api: exports.apiConfig
};
