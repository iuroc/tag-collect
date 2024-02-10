# Tag Collect

在线网址收藏系统，支持自定义标签序列，并通过组合标签的方式进行检索。

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

```
git clone https://github.com/iuroc/tag-collect.git
cd tag-collect
npm install
npm run build
npm start
```

## 开发环境

```
git clone https://github.com/iuroc/tag-collect.git
cd tag-collect
npm install
npm run dev
```

## 功能设计

- 支持用户登录注册
- 新增收藏：收藏描述、收藏地址、标签列表、备注
- 查询收藏：模糊搜索、标签组合筛选

```
-----------------------
 蓝奏云 - 官方网站
 https://www.lanzou.com/xxx/index.html
 #XX #XX #xx
 备注内容
-----------------------
```

## 技术探索

- [Bootstrap 实现回退历史记录关闭模态框](https://www.wolai.com/iuroc/thDKZYS893MhvYDZCYda6Q)

## 规范探索

> 关于如何定义和使用标签，以及如何组合

1. 标签原子化
2. 标签迭代化，不断淘汰语义相似和使用频率低的标签
3. 虚拟主机，应该拆分为“虚拟+主机”，这样才能让虚拟和主机都能被复用
4. 对于英文缩写和中文全称，如果对这个缩写非常熟悉，比如 AI，那就使用 AI 而不是人工智能，再比如 HTML 也是如此。而如果是一些生僻的英文缩写，那就应该使用其熟知的中文或英文全称
5. 只要是词语组合，都应该被分割，比如“虚拟 + 主机”、“生成 + 式”
6. 英文单词包含大小写时，应该使用其广泛传播的书面形式，比如 OpenAI，而不是 openai
7. 只要标签的意思不重叠，标签数量越多越好，标签越多，意味着检索到的可能性越大，用户体验更好