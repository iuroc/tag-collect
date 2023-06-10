/** API 接口配置 */
export const apiConfig = {
    /** 网页标题获取，`=` 结尾，内置接口为 `/api/getTitle` */
    getTitle: 'https://get-html.9494666.xyz/?type=title&url=',
    /** 新增收藏 */
    add: '/api/add',
    /** 获取标签列表 */
    getTag: '/api/tagList',
    /** 登录接口 */
    login: '/api/login',
    /** 注册接口 */
    register: '/api/register',
    /** 发送验证码 */
    sendCode: '/api/sendCode'
}

/** 网站配置 */
export const config = {
    /** API 接口配置 */
    api: apiConfig
}