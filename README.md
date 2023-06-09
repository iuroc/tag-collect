# Tag Collect

> 标签式收藏管理系统

## 技术栈

- Go
- MySQL
- TypeScript

## 开源依赖

- [Apee-Router](https://github.com/oyps/apee-router)

## 项目信息

- 作者：欧阳鹏
- 博客：[apee.top](https://apee.top)
- 开发日期
    - 2022 年 6 月 27 日，[第一代 My Pages](https://github.com/oyps/mypages)
    - 2023 年 4 月 28 日，Tag Collect 使用 Python Flask + SQlite，已停止开发
    - 2023 年 5 月 27 日，Tag Collect 使用 Go + MySQL 重构开发

## 开发环境

### 命令说明

- 安装依赖：`npm install`
- 启动开发环境：`npm run dev`
- 每次修改完前端，执行 `npm run build`
- 每次修改完后端，执行 `npm run serve`

## 项目文件结构

1. `src`：前端 TS 源码
2. `static`：静态资源
    1. `js`：前端 JS 编译导出
    2. `dist`：前端 JS 打包导出
3. `serve`：后端 Go 源码