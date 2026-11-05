---
title: 这是一个简单的小引导（？）
published: 2026-03-20
description: "点进来更神！"
tags: ["测试向", "博客", "分享"]
category: 指引
draft: false
---
本站基于 [saicaca 的 Fuwari 模板](https://github.com/saicaca/fuwari) 搭建。下方文章配置示例与字段说明改编自 Fuwari 的示例文章，相关模板内容遵循 MIT 许可，完整文本见页脚的 Licenses。

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
