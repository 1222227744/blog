---
title: Git 入门速查：初始化、暂存区、分支与回退
published: 2025-10-09
updated: 2026-04-24
description: 把零散的 Git 笔记合并成一篇完整入门文章，覆盖初始化、暂存区、分支、合并、撤销与忽略规则。
tags: ["Git", "版本控制", "gitignore", "分支", "入门"]
category: Git
lang: zh_CN
draft: false
---

这篇文章把几份 Git 学习笔记合并成一条更顺的学习路径：先理解本地仓库和远程仓库，再掌握暂存区与忽略规则，最后补上分支、合并和历史回退。

## 1. 本地仓库和远程仓库分别是什么

- 本地仓库：你电脑上的 Git 历史记录和工作目录
- 远程仓库：托管在 GitHub、GitLab 等平台上的共享仓库

刚开始用 Git，最常见的起点只有两个：

1. 在现有目录里初始化一个仓库
2. 从远程仓库拉一份到本地

## 2. `git init` 和 `git clone`

### 新建本地仓库

```bash
git init
```

这条命令会在当前目录初始化一个 Git 仓库，适合“我已经有项目文件，现在想纳入版本管理”的场景。

### 从远程仓库拉取

```bash
git clone <repository-url>
```

这条命令会把远程仓库完整复制到当前目录下，适合“项目已经在 GitHub 上，我要把它下载到本地继续开发”的场景。

## 3. 暂存区是 Git 工作流里的中间站

很多新手觉得 Git 难，本质上是没搞清楚“工作区”和“暂存区”的区别。

- 工作区：你正在编辑的真实文件
- 暂存区：下一次提交准备带走的那一批更改

最常用的几个命令如下。

### 查看当前状态

```bash
git status
```

它会告诉你：

- 哪些文件改了但还没暂存
- 哪些文件已经进入暂存区
- 当前分支是否干净

### 把文件加入暂存区

```bash
git add 文件名
git add *.md
```

`git add` 支持通配符，适合批量把一类文件加入暂存区。

### 把文件从暂存区移除

```bash
git rm --cached 文件名
```

这个命令会把文件从暂存区移除，但不会删除工作区里的实际文件，常用于：

- 暂存错了文件
- 某个文件本来就不该被 Git 跟踪

### 提交到本地仓库

```bash
git commit -m "描述信息"
```

只有进入暂存区的内容，才会被这次提交带走。

### 查看提交记录

```bash
git log
```

如果你想快速回顾版本历史，这条命令是最直接的入口。

## 4. `.gitignore` 是项目清洁规则

`.gitignore` 的作用很简单：告诉 Git 哪些文件不应该进入版本管理。

典型例子：

- 编译产物
- 日志文件
- 本地缓存
- IDE 配置
- 密钥和环境变量文件

一个常见示例：

```gitignore
# dependencies
node_modules/

# build output
dist/

# logs
*.log

# local env
.env
```

> [!tip]
> 如果某个文件已经被 Git 跟踪，仅仅写进 `.gitignore` 还不够，通常还要配合 `git rm --cached 文件名` 才能停止继续追踪。

## 5. 创建分支和切换分支

### 查看当前仓库有哪些分支

```bash
git branch
```

### 创建新分支，但暂时不切换

```bash
git branch feature/login
```

### 创建并立即切换

```bash
git checkout -b feature/login
```

虽然 `checkout -b` 很常见，但现在更推荐把“切换分支”交给语义更清晰的 `switch`。

### 切换到已有分支

```bash
git switch main
git switch feature/login
```

## 6. 合并分支的最常见流程

合并时，先切到目标分支，再执行 `merge`。

```bash
git switch main
git merge feature/login
```

这也是最常见的一种心智模型：

- 先站到主分支上
- 再把功能分支的结果并进来

如果出现冲突，就手动修改冲突文件，然后继续：

```bash
git add 冲突文件
git commit
```

## 7. `revert` 和 `reset` 不要混用

这是 Git 入门里非常容易混淆的一组概念。

### `git revert`

```bash
git revert <commit-id>
```

它的特点是：

- 不删除原提交
- 通过新增一个“反向提交”来抵消旧改动
- 更适合已经共享出去的提交历史

如果出现冲突，通常流程是：

```bash
git add 文件名
git revert --continue
```

### `git reset`

```bash
git reset --mixed <commit-id>
git reset --soft <commit-id>
git reset --hard <commit-id>
```

这三种模式需要明确区分：

| 模式 | HEAD | 暂存区 | 工作区 |
| --- | --- | --- | --- |
| `--soft` | 回退 | 保留 | 保留 |
| `--mixed` | 回退 | 重置 | 保留 |
| `--hard` | 回退 | 重置 | 重置 |

> [!warning]
> `git reset --hard` 会直接丢弃未提交的工作区改动。只在你完全确定不再需要这些内容时使用。

## 8. `checkout` 到历史提交时会进入分离头指针

```bash
git checkout <commit-id>
```

这条命令会让 `HEAD` 直接指向某个历史提交，而不是某个分支。常见用途是：

- 临时查看旧版本
- 在历史节点上做实验

如果你想把这段实验继续保留下来，可以从这个分离状态新建一个分支：

```bash
git branch hotfix-from-old <commit-id>
```

## 9. 删除分支

```bash
git branch -d branch-name
git branch -D branch-name
```

区别很直接：

- `-d` 只删除已经安全合并的分支
- `-D` 强制删除，即使这个分支还没完全合并

`-D` 确实是删除“未完全合并分支”时最直接的方法，但使用前要确认内容是否真的不需要了。

## 10. 一条最小可用流程

下面这组命令足够支撑一个最基础的日常循环：

```bash
git status
git add .
git commit -m "docs: add first notes"
git log
```

如果是新项目，则往前再补一步：

```bash
git init
```

如果是已有远程项目，则改成：

```bash
git clone <repository-url>
```

如果你需要一条更完整的分支工作流，可以按这个顺序：

```bash
git switch main
git pull
git switch -c feature/post-layout

# 开发、提交若干次

git switch main
git merge feature/post-layout
git branch -d feature/post-layout
```

## 11. 初学 Git 时最值得优先记住的事

1. 先看 `git status`，再执行下一步
2. `git add` 加的是“准备提交的内容”，不是“永久保存”
3. `.gitignore` 负责减少噪音，但对已经被跟踪的文件不会自动生效
4. 已经推送到远程、需要保留历史可读性时，优先用 `git revert`
5. 只是本地整理提交、且确认不会影响别人时，再考虑 `git reset`
6. 合并之前先确认自己当前所在的分支
7. 提交信息尽量写清楚，不要长期使用 `update` 这种模糊描述

当你把 `init / clone -> status -> add -> commit -> branch / switch -> merge -> revert / reset` 这条主线跑顺，Git 的基本使用就已经稳定了。
