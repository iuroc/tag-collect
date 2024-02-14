# Tag Collect

标签式收藏管理系统，支持自定义标签序列，并通过组合标签的方式进行检索。

## 项目概述

-   作者：欧阳鹏
-   开发日期：2024 年 2 月 5 日
-   技术栈
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Node.js](https://nodejs.org/en)
    -   [MySQL](https://www.mysql.com/)
    -   [Bootstrap](https://getbootstrap.com/)
    -   HTML、CSS、JavaScript

## 部署方式

1. 将 [tag_collect.sql](tag_collect.sql) 导入到 MySQL 数据库
2. 执行下面的命令：

    ```
    git clone https://github.com/iuroc/tag-collect.git
    cd tag-collect
    npm install
    npm run build
    npm start
    ```

## 开发环境

1. 将 [tag_collect.sql](tag_collect.sql) 导入到 MySQL 数据库
2. 执行下面的命令：

    ```
    git clone https://github.com/iuroc/tag-collect.git
    cd tag-collect
    npm install
    npm run dev
    ```

## 宝塔面板 + Node 项目管理 + CDN

**初次部署：**

- 在 Node.js 项目目录，打开终端，克隆项目
- 执行 `npm install` 和 `npm run build`
- 在 Node 网站管理页面，添加 Node 项目，将执行脚本设置为 `start`，并设置域名
- 在 CDN 管理页面，添加 CDN 项目，将回源 Host 设置为服务器 IP
- 设置 `/api` 目录不缓存，其余均缓存
- 将域名解析到 CDN 的 CNAME 地址

**后续更新：**

- 在 Node.js 项目目录，打开终端，进入 `tag-collect`，执行 `git pull`
- 执行 `npm run build`
- 在 Node 网站管理页面，重启项目
- 在 CDN 管理页面，刷新预热站点主页 `http://{your_host}:6790/`

## 主要功能

- 新增收藏（自定义标题、网址、标签、详细描述）
- 编辑收藏、删除收藏
- 记录搜索（模糊搜索、组合标签匹配）
- 登录注册（JWT + Bcrypt）
- 自动抓取网页标题，自动对标题分词

## 技术探索

- [Bootstrap 实现回退历史记录关闭模态框](https://www.wolai.com/iuroc/thDKZYS893MhvYDZCYda6Q)
- [Cloudflare Worker 实现抓取网页标题](/worker/get-html.js)

## 规范探索

> 关于如何定义和使用标签，以及如何组合

1. 标签原子化
2. 标签迭代化，不断淘汰语义相似和使用频率低的标签
3. 虚拟主机，应该拆分为“虚拟+主机”，这样才能让虚拟和主机都能被复用
4. 对于英文缩写和中文全称，如果对这个缩写非常熟悉，比如 AI，那就使用 AI 而不是人工智能，再比如 HTML 也是如此。而如果是一些生僻的英文缩写，那就应该使用其熟知的中文或英文全称
5. 只要是词语组合，都应该被分割，比如“虚拟 + 主机”、“生成 + 式”
6. 英文单词包含大小写时，应该使用其广泛传播的书面形式，比如 OpenAI，而不是 openai
7. 只要标签的意思不重叠，标签数量越多越好，标签越多，意味着检索到的可能性越大，用户体验更好