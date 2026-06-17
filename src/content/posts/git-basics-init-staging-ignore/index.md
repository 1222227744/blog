---
title: Git 实战速查与原理入门：从配置到协作救火
published: 2025-10-09
updated: 2026-06-18
description: 以一篇长文系统梳理 Git 的配置、提交、分支、远程协作、历史排查与撤销救火，兼顾速查与理解。
tags: ["Git", "版本控制", "gitignore", "分支", "协作"]
category: Git
lang: zh_CN
draft: false
---

这篇文章按“一条主线 + 多个专题”的方式整理 Git。你可以把它当成一份偏原理的速查手册：平时忘命令时回来查，遇到冲突、回退、误删时也能顺着定位问题。

## 1. 先建立正确心智模型

Git 不是“云端网盘”，它本质上是一个**记录项目历史的分布式版本控制系统**。理解 Git，最关键的是先区分下面几个区域：

| 区域 | 你能看到什么 | 典型命令 | 作用 |
| --- | --- | --- | --- |
| 工作区 | 当前真实文件 | `git status` `git diff` | 你正在修改的内容 |
| 暂存区 | 下一次准备提交的快照 | `git add` `git restore --staged` | 给提交“打包” |
| 本地仓库 | 本机提交历史 | `git commit` `git log` | 保存可回溯历史 |
| 远程仓库 | GitHub/GitLab 上的共享历史 | `git fetch` `git pull` `git push` | 团队同步 |

可以把它理解成下面这条流水线：

```text
工作区 --git add--> 暂存区 --git commit--> 本地仓库 --git push--> 远程仓库
   ^                       |                                   |
   |                       |                                   |
git restore         git restore --staged                 git fetch / pull
```

> [!important]
> 很多 Git 误操作，本质上不是命令不会背，而是不知道“自己现在改的是工作区、暂存区，还是提交历史”。

## 2. 基础配置与初始化

### 2.1 `git config`：先把身份信息配置好

第一次装完 Git，最先应该设置的是用户名和邮箱。

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

这两个字段会写进提交记录里，后续 `git log`、GitHub 提交归属、代码责任追踪都会用到。

Git 配置有作用域差异：

| 作用域 | 命令示例 | 影响范围 |
| --- | --- | --- |
| 系统级 | `git config --system` | 当前机器所有用户 |
| 全局级 | `git config --global` | 当前用户所有仓库 |
| 仓库级 | `git config --local` | 当前仓库 |

查看已有配置：

```bash
git config --list
git config --global --list
```

一些常见的别名配置：

```bash
git config --global alias.st status
git config --global alias.br branch
git config --global alias.co checkout
git config --global alias.lg "log --oneline --graph --decorate --all"
```

> [!tip]
> 别名不是必须，但对高频命令很省时间。尤其 `git lg` 这种图形化日志别名，排查分支历史很有帮助。

### 2.2 `git init`：把一个已有目录纳入 Git

```bash
git init
```

适用场景：项目文件已经存在，但还没有 Git 历史。

执行后 Git 会创建 `.git` 目录，用来保存对象、引用、配置等元数据。你可以把 `.git` 理解成“仓库的大脑”，工作文件删了还能重建，`.git` 坏了历史就没了。

常见初始化流程：

```bash
git init
git status
git add .
git commit -m "chore: initialize repository"
```

### 2.3 `git clone`：从远程复制一份完整仓库

```bash
git clone <repository-url>
```

适用场景：项目已经托管在 GitHub、GitLab 或其它远程平台。

常见变体：

```bash
git clone <repository-url>
git clone <repository-url> my-project
git clone --depth 1 <repository-url>
```

不同写法的含义：

| 命令 | 含义 |
| --- | --- |
| `git clone <url>` | 克隆完整仓库 |
| `git clone <url> my-project` | 指定本地目录名 |
| `git clone --depth 1 <url>` | 浅克隆，只拉最近历史，适合 CI 或只读场景 |

> [!caution]
> `--depth 1` 很适合节省体积，但会丢掉完整历史。在需要 `git log`、`git bisect`、复杂合并分析时会受限。

## 3. 核心工作流：修改、暂存、提交

### 3.1 `git status`：每次操作前先看状态

```bash
git status
git status -s
```

`git status` 是 Git 的总入口。你不确定当前发生了什么时，先跑它几乎总是对的。

精简输出 `-s` 常见标记：

| 输出 | 含义 |
| --- | --- |
| `?? file` | 未跟踪文件 |
| `M file` | 工作区已修改但未暂存 |
| `A file` | 已加入暂存区 |
| `MM file` | 已暂存后又继续修改 |
| `D file` | 删除了文件 |

例如：

```text
 M src/app.ts
M  README.md
MM package.json
?? docs/tmp.md
```

可以这样理解：

- 第一列表示暂存区状态
- 第二列表示工作区状态
- `??` 表示 Git 还没跟踪这个文件

### 3.2 `git add`：把“本次想提交的内容”放进暂存区

```bash
git add main.cpp
git add src/
git add .
git add -p
```

最容易误解的点是：`git add` 加的不是“文件存在”，而是“**这次提交准备带走的那个版本**”。

常见用法：

| 命令 | 用途 |
| --- | --- |
| `git add 文件名` | 暂存单个文件 |
| `git add 目录名` | 暂存目录下所有变更 |
| `git add .` | 暂存当前目录所有变更 |
| `git add -p` | 分块选择暂存，适合把一次大改拆成多次提交 |

`git add -p` 很值得掌握，因为它允许你把一个文件里互不相关的修改拆开提交，更符合“一个提交只做一件事”的原则。

### 3.3 `git commit`：把暂存区快照写进本地历史

```bash
git commit -m "feat: support dark mode"
git commit --amend
```

你可以把 `commit` 理解成：

- 把暂存区内容打一个历史快照
- 生成一个新的提交节点
- 让当前分支指向这个新节点

一个提交通常包含两部分：

| 部分 | 作用 |
| --- | --- |
| 提交内容 | 当时的文件快照与差异 |
| 提交信息 | 说明“这次做了什么、为什么这样做” |

`--amend` 的用途：

- 刚提交完，发现漏加了文件
- 提交信息写错了，想补一下

```bash
git add missed-file.ts
git commit --amend
```

> [!warning]
> `git commit --amend` 会改写最近一次提交。如果这次提交已经推送并被别人基于它继续开发，就不要随便改。

### 3.4 `git rm`、`git mv`、`git clean`

#### 删除文件

```bash
git rm file.txt
git rm --cached secret.env
```

区别：

| 命令 | 工作区文件 | 暂存区 | 用途 |
| --- | --- | --- | --- |
| `git rm file.txt` | 删除 | 记录删除 | 文件真的不需要了 |
| `git rm --cached file.txt` | 保留 | 取消跟踪 | 文件应留在本地但不再纳入版本管理 |

#### 重命名或移动文件

```bash
git mv old-name.md new-name.md
```

虽然你直接用系统重命名也可以，Git 最后通常也能识别，但 `git mv` 更明确、脚本化也更方便。

#### 清理未跟踪文件

```bash
git clean -n
git clean -f
git clean -fd
```

| 命令 | 含义 |
| --- | --- |
| `git clean -n` | 预演会删什么 |
| `git clean -f` | 删除未跟踪文件 |
| `git clean -fd` | 连未跟踪目录一起删 |

> [!caution]
> `git clean` 针对的是**未跟踪文件**，删掉后通常很难从 Git 历史里找回。建议先用 `-n` 预演。

## 4. `.gitignore`：让 Git 忽略不该提交的内容

`.gitignore` 用来描述“哪些文件不应该被纳入版本管理”。最常见的是：

- 依赖目录
- 构建产物
- 日志
- 本地缓存
- IDE 配置
- 密钥和环境变量文件

示例：

```gitignore
# dependencies
node_modules/

# build output
dist/
coverage/

# logs
*.log

# local env
.env
.env.local

# editor
.vscode/
.idea/
```

### 4.1 为什么写了 `.gitignore` 还是没生效

因为 `.gitignore` 只影响“**尚未被跟踪**”的文件。

如果文件已经被 Git 跟踪，正确流程是：

```bash
git rm --cached .env
git commit -m "chore: stop tracking env file"
```

### 4.2 本地临时文件不想提交怎么办

如果某个文件只是你本地临时使用，不想写进仓库级 `.gitignore`，可以用：

- `.git/info/exclude`：只对当前仓库、本机生效
- 全局 ignore：只对当前用户生效

这类本地忽略很适合：

- 草稿文件
- 调试脚本
- 临时导出的截图或日志

## 5. 分支艺术：并行开发与合流

分支可以理解成“同一段历史上的不同开发路线”。它的价值在于：

- 主线保持稳定
- 新功能独立开发
- 修复 Bug 时互不干扰

### 5.1 `git branch`：查看、创建、删除分支

```bash
git branch
git branch -a
git branch feature/login
git branch -d feature/login
git branch -D feature/login
```

常见场景：

| 命令 | 作用 |
| --- | --- |
| `git branch` | 查看本地分支 |
| `git branch -a` | 查看本地和远程分支 |
| `git branch new-branch` | 创建新分支 |
| `git branch -d name` | 删除已合并分支 |
| `git branch -D name` | 强制删除分支 |

### 5.2 `git switch`：更纯粹的切换命令

```bash
git switch main
git switch -c feature/login
```

相比旧命令 `checkout`，`switch` 的语义更单一：

- `switch` 负责切换分支
- `restore` 负责恢复文件

这样比过去把很多职责都塞给 `checkout` 更不容易误操作。

### 5.3 `git merge`：把一条开发线并回另一条线

最常见流程：

```bash
git switch main
git merge feature/login
```

理解 `merge` 的关键，不是死背命令，而是知道它在做什么：

- 找到两个分支的共同祖先
- 计算两边分别改了什么
- 尝试自动合并成一个结果

#### 快进合并和非快进合并

| 类型 | 特征 | 何时出现 |
| --- | --- | --- |
| Fast-forward | 只移动指针，不生成新提交 | 主分支自分叉后没有新提交 |
| `--no-ff` | 强制生成一个合并提交 | 想保留分支合流痕迹 |

```bash
git merge --no-ff feature/login
```

一个简单示意：

```text
Fast-forward:
A -- B -- C  (main)
          \
            D -- E (feature)

merge 后:
A -- B -- C -- D -- E (main)

Non-fast-forward:
A -- B -- C ------ M (main)
          \      /
            D -- E (feature)
```

#### 遇到冲突怎么办

标准流程：

```bash
git status
git add 冲突文件
git commit
```

处理顺序通常是：

1. 打开冲突文件
2. 手动决定保留哪部分内容
3. 删除冲突标记
4. `git add` 标记“这个冲突已解决”
5. 提交合并结果

### 5.4 `git rebase`：重放提交，整理历史

```bash
git switch feature/login
git rebase main
```

`rebase` 的本质不是“合并”，而是把你当前分支上的提交，拿下来，重新排到另一个基底后面。

对比 `merge` 和 `rebase`：

| 命令 | 结果 | 优点 | 风险 |
| --- | --- | --- | --- |
| `git merge` | 保留分叉历史 | 安全、直观 | 历史图可能更复杂 |
| `git rebase` | 改写为线性历史 | 历史整洁 | 会改写提交 ID |

黄金法则：

> [!warning]
> 不要随便对已经推送、且别人可能正在使用的公共分支做 `rebase`。

这是因为 `rebase` 会改写历史，别人本地的旧提交 ID 会和你的新历史不一致。

### 5.5 `git cherry-pick`：跨分支挑一笔提交过来

```bash
git cherry-pick <commit-id>
```

适合场景：

- 某个热修复本来在 A 分支，但 B 分支也要补同一修复
- 不想整个分支合并，只想拿其中一个提交

它的本质是：把指定提交的改动内容，重新生成一笔新提交，放到当前分支上。

## 6. 远程协同：和 GitHub / GitLab 同步

### 6.1 `git remote`：管理远程源

```bash
git remote -v
git remote add origin <url>
git remote set-url origin <new-url>
git remote remove origin
```

`remote` 可以理解成“远程仓库的别名表”。最常见的名字是 `origin`。

| 命令 | 用途 |
| --- | --- |
| `git remote -v` | 查看远程地址 |
| `git remote add origin <url>` | 新增远程源 |
| `git remote set-url origin <url>` | 修改远程地址 |
| `git remote remove origin` | 删除远程源配置 |

### 6.2 `git fetch` vs `git pull`

这是最常见的概念混淆点之一。

| 命令 | 做了什么 | 是否改当前工作区 |
| --- | --- | --- |
| `git fetch` | 只拉远程最新提交到本地远程跟踪分支 | 否 |
| `git pull` | `fetch + merge`（或 `fetch + rebase`） | 是 |

可以简单记成：

```text
git fetch = 先把远程变化拿下来看看
git pull  = 拿下来并直接尝试整合进当前分支
```

常见命令：

```bash
git fetch origin
git pull origin main
git pull --rebase origin main
```

`git pull --rebase` 很适合个人功能分支，因为它能减少不必要的 merge commit，让历史更线性。

### 6.3 `git push`：把本地历史同步到远程

```bash
git push
git push origin main
git push -u origin feature/login
```

常见场景：

| 命令 | 用途 |
| --- | --- |
| `git push` | 推送当前分支到已配置上游 |
| `git push origin main` | 推送到指定远程分支 |
| `git push -u origin feature/login` | 首次推送并建立追踪关系 |

#### 为什么不建议直接 `--force`

因为强推会改写远程历史，别人已经拉下来的提交可能会失配。

更安全的写法：

```bash
git push --force-with-lease
```

它的含义是：只有在远程分支还是你预期的状态时，才允许强推。这样能避免把别人的新提交顶掉。

### 6.4 上游分支与追踪关系

```bash
git push -u origin feature/login
git branch --set-upstream-to=origin/main main
```

设置完上游分支后，你后续就可以直接：

```bash
git pull
git push
```

而不必每次都手写远程名和分支名。

## 7. 历史追踪与审查

### 7.1 `git log`：看历史的入口

```bash
git log
git log --oneline
git log --oneline --graph --decorate --all
git log --author="Alice"
git log --since="2026-06-01"
```

推荐优先记住这条：

```bash
git log --oneline --graph --decorate --all
```

它能让你快速看到：

- 分支分叉和合流
- 当前 HEAD 在哪里
- tag 和分支标签挂在哪些提交上

### 7.2 `git diff`：比较差异到底在哪

这是另一个高频混淆点。`diff` 一定要带着“比较的两端分别是谁”来理解。

| 命令 | 比较对象 |
| --- | --- |
| `git diff` | 工作区 vs 暂存区 |
| `git diff --cached` | 暂存区 vs 最近一次提交 |
| `git diff HEAD` | 工作区 + 暂存区 vs 最近一次提交 |
| `git diff main..feature/login` | 两个分支的差异 |

一个简图：

```text
git diff           = 看“还没 add 的改动”
git diff --cached  = 看“已经 add 但还没 commit 的改动”
git diff HEAD      = 看“总共准备改了什么”
```

### 7.3 `git show`：看某个提交的详细内容

```bash
git show <commit-id>
git show HEAD~1
```

适合场景：

- 查某次提交到底改了什么
- 看某个 tag 对应版本内容
- 快速检查一笔刚提交的改动

### 7.4 `git blame`：追踪某一行是谁改的

```bash
git blame src/app.ts
git blame -L 20,40 src/app.ts
```

`blame` 很适合：

- 查某一行是谁引入的
- 找对应提交，再配合 `git show` 看上下文
- 排查“为什么这段逻辑会变成这样”

但它不应该被理解成“找人背锅”的工具，更合理的用途是找上下文和决策线索。

## 8. 时光倒流与救火操作

这一部分是 Git 含金量最高的地方。真正出问题时，你最需要的是分清：**我是想撤销工作区、撤销暂存区，还是撤销提交历史**。

### 8.1 `git restore`：处理工作区和暂存区

```bash
git restore file.txt
git restore --staged file.txt
git restore --source=HEAD~1 file.txt
```

| 命令 | 作用 |
| --- | --- |
| `git restore file.txt` | 丢弃工作区修改 |
| `git restore --staged file.txt` | 把文件从暂存区撤回工作区 |
| `git restore --source=<commit> file.txt` | 用指定提交版本恢复文件 |

这正是为什么现在推荐：

- 用 `switch` 切分支
- 用 `restore` 恢复文件

这样比旧时代“一把梭的 checkout”更清晰。

### 8.2 `git reset`：移动分支指针，必要时连暂存区/工作区一起回退

```bash
git reset --soft <commit-id>
git reset --mixed <commit-id>
git reset --hard <commit-id>
```

这是必须吃透的一张表：

| 模式 | HEAD | 暂存区 | 工作区 | 适合场景 |
| --- | --- | --- | --- | --- |
| `--soft` | 回退 | 保留 | 保留 | 想重写最近提交，但保留改动 |
| `--mixed` | 回退 | 重置 | 保留 | 想取消暂存并重新整理提交 |
| `--hard` | 回退 | 重置 | 重置 | 想彻底回到某个提交 |

可以把它理解成“影响范围逐层扩大”：

```text
--soft  只动提交指针
--mixed 动提交指针 + 暂存区
--hard  动提交指针 + 暂存区 + 工作区
```

> [!warning]
> `git reset --hard` 会直接覆盖工作区内容。只在你确认本地改动不再需要时使用。

### 8.3 `git revert`：用一笔新提交抵消旧提交

```bash
git revert <commit-id>
```

`revert` 不会删除历史，而是新增一笔“反向提交”。

它特别适合：

- 公共分支回滚错误改动
- 已经推送到远程的历史修正
- 希望保留“撤销动作本身”的审计痕迹

如果有冲突：

```bash
git add 冲突文件
git revert --continue
```

### 8.4 `git stash`：临时把当前改动收起来

```bash
git stash
git stash list
git stash apply
git stash pop
git stash drop
```

常见场景：正在写一半功能，突然要切去修线上 Bug。

| 命令 | 含义 |
| --- | --- |
| `git stash` | 暂存当前改动 |
| `git stash list` | 查看 stash 列表 |
| `git stash apply` | 恢复，但不删除 stash 记录 |
| `git stash pop` | 恢复，并删除这条 stash |
| `git stash drop` | 删除某条 stash |

> [!tip]
> 不确定要不要保留 stash 记录时，先用 `apply`，确认没问题再自己删。`pop` 更适合你很确定这是一次性临时切换。

### 8.5 `git reflog`：真正的后悔药

```bash
git reflog
```

`reflog` 记录的是 **HEAD 和分支引用移动过的历史**。哪怕你：

- reset 过头了
- rebase 搞乱了
- 删了分支
- amend 覆盖了提交

只要那笔提交在本地引用历史里出现过，通常还有机会救回来。

典型救援流程：

```bash
git reflog
git reset --hard <某个还能看到的提交>
```

这也是为什么很多老开发说：

> [!important]
> Git 真正可怕的不是“做错了”，而是“没看状态就乱做，做完也不知道自己改了哪一层”。

## 9. 日常工作流范例

### 9.1 单人开发的最小闭环

```bash
git status
git add .
git commit -m "feat: add article search"
git push
```

### 9.2 团队功能分支工作流

```bash
git switch main
git pull --rebase
git switch -c feature/post-layout

# 开发若干次
git status
git add -p
git commit -m "feat: redesign post card"

git fetch origin
git rebase origin/main
git push -u origin feature/post-layout
```

提合并请求前，如果主分支已经继续往前走了，可以先同步主线，再减少冲突。

### 9.3 紧急修 Bug 的插队流程

```bash
git stash
git switch main
git pull --rebase
git switch -c hotfix/login-redirect

# 修复并提交
git add .
git commit -m "fix: correct login redirect"
git push -u origin hotfix/login-redirect

# 回到原功能分支
git switch feature/post-layout
git stash pop
```

## 10. 高级进阶与工程化

### 10.1 `git tag`：给版本打标签

```bash
git tag
git tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
git push origin --tags
```

tag 常用于：

- 版本发布
- 里程碑标记
- 回溯线上某个正式版本

### 10.2 `git submodule`：把别的仓库作为子目录引用

```bash
git submodule add <repository-url> vendor/lib
git submodule update --init --recursive
```

适合“大项目依赖另一个独立仓库”的场景，但也会提升管理复杂度。没有明确需要时，通常不建议一上来就用。

### 10.3 `git bisect`：二分法定位是哪次提交引入了 Bug

```bash
git bisect start
git bisect bad
git bisect good <good-commit>
```

之后 Git 会不断把历史折半，让你判断“当前这版是好还是坏”，最终把问题缩到某一个提交。

这在“最近几十次提交里不知道是谁引入了回归”的场景非常有价值。

### 10.4 Git Hooks：把检查前置到提交前

常见思路：

- `pre-commit` 跑 lint 或格式化
- `commit-msg` 校验提交信息格式
- `pre-push` 跑测试

它的意义不是“加流程”，而是把低成本错误尽量拦在本地，而不是让它流进主分支或 CI。

## 11. 最常混淆命令对照表

### 11.1 `fetch` / `pull`

| 问题 | 更适合的命令 |
| --- | --- |
| 我只想先看看远程更新 | `git fetch` |
| 我想直接把远程更新并进当前分支 | `git pull` |
| 我想保持线性历史 | `git pull --rebase` |

### 11.2 `restore` / `reset` / `revert`

| 需求 | 更适合的命令 |
| --- | --- |
| 丢弃工作区文件修改 | `git restore file` |
| 取消暂存 | `git restore --staged file` |
| 本地回退提交并重整历史 | `git reset` |
| 公共历史里安全撤销某次提交 | `git revert` |

### 11.3 `merge` / `rebase` / `cherry-pick`

| 需求 | 更适合的命令 |
| --- | --- |
| 保留完整分支合流痕迹 | `git merge` |
| 整理为更线性的提交历史 | `git rebase` |
| 只拿另一分支里某一笔提交 | `git cherry-pick` |

## 12. 初学 Git 最值得优先记住的原则

1. 每次操作前先看 `git status`。
2. 不要把 `git add` 理解成“保存文件”，它只是“把这次提交要带走的内容放进暂存区”。
3. `.gitignore` 只对未跟踪文件生效，已跟踪文件要配合 `git rm --cached`。
4. 已推送到公共分支的错误，优先考虑 `git revert`，不要默认上来就 `reset --hard`。
5. `rebase` 很强，但本质是改写历史；公共分支上要非常谨慎。
6. 遇到冲突别慌，先分清自己是在处理工作区、暂存区，还是提交历史。
7. `reflog` 是很多“看起来已经没救”的场景最后的兜底。
8. 提交信息要写清楚，让未来的你和队友都能看懂当时为什么这么改。

如果你把这篇文章里的主线真正跑顺，大致会形成这样的操作感：

```text
初始化 / 克隆
-> 查看状态
-> 暂存改动
-> 提交历史
-> 分支开发
-> 同步远程
-> 审查差异
-> 出问题时用 restore / reset / revert / stash / reflog 救火
```

Git 难的地方从来不是命令数量，而是状态层次很多。把层次分清楚之后，大部分命令都会变得非常直观。
