---
title: 这是一个简单的小引导（？）
published: 2026-03-020
description: "点进来更神！"
image: "./cover.jpg"
tags: ["测试向", "博客", "分享"]
category: 指引
draft: false
---
> Cover image source: [Source](https://www.miyoushe.com/zzz/article/69603606)

这个博客模板是我从[Github](github.com)上clone下来的，[原作者在此](https://github.com/saicaca)

## Front-matter of Posts

```yaml
---
title: 初次见面
published: 2026-03-20
description: 这是一个用于测试的Demo
image: ./cover.jpg
tags: [菜, 爱玩]
category: 引导
draft: false
---
```


| Attribute     | Description                                                                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | The title of the post.                                                                                                                                                                                      |
| `published`   | The date the post was published.                                                                                                                                                                            |
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `draft`       | If this post is still a draft, which won't be displayed.                                                                                                                                                    |

## 项目目录

博客文件应该放在 `src/content/posts/` 文件夹下，或者也可以在此创建子文件夹来组织管理博客

```
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```
