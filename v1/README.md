# 标签式收藏系统

## 功能规划

- 新增收藏
    - 网站收藏模式
    - 输入网站标题
    - 输入网站地址
    - 输入描述文本
    - 输入标签列表
- 文本收藏模式
    - 输入文本标题
    - 输入原文地址
    - 输入文本内容
    - 输入标签列表
    - 对于标题：手动编辑，或者点击通过 URL 获取
    - 对于 URL：点击提取根 URL
    - 对于内容：支持 Markdown，使用

## 环境搭建

- 安装 `Flask` 模块：`pip install flask`
- 安装 `requests` 模块：`pip install requests`
- 安装 `yarn` 包管理器：`npm install -g yarn`
- 安装 JS 模块：`yarn install --dev`
- 启动开发环境：`yarn dev`
- 启动运行项目：`yarn start`
- 浏览器访问 `127.0.0.1:5000` 端口即可

## Docker 安装小技巧

1. 修改 `pip` 源

    ```bash
    pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
    ```
2. 修改 `npm` 和 `yarn` 源

    （如果你修改了 yarn 的源，需要删除 yarn.lock 文件对本项目生效）

    ```bash
    npm config set registry https://registry.npmmirror.com
    yarn config set registry https://registry.npmmirror.com
    ```

## 相关配置文件

1. 前端配置文件：`src/config.ts`
2. 后端配置文件：`.env`

## 配置 Cloudflare Workers 代理

代码在 [`/workers/get_html.js`](/workers/get_html.js) 中。