---
title: Git 实战手册：配置、协作、回退与进阶
published: 2025-10-09
updated: 2026-06-18
description: 一篇覆盖 Git 配置、提交、分支、远程协作、历史排查、撤销救火和进阶工具的长文速查手册。
tags: ["Git", "版本控制", "分支", "协作", "速查"]
category: Git
lang: zh_CN
draft: false
---

这篇文章把原来的 Git 笔记整理成了可查可学的一篇长文。你可以把它当成手册：忘命令时查，想理解原理时也能顺着读下去。

## 目录

- [1. 心智模型](#git-model)
- [2. 配置与初始化](#git-config)
- [3. 修改、暂存与提交](#git-workflow)
- [4. 忽略规则](#git-ignore)
- [5. 分支、合并与历史改写](#git-branching)
- [6. 冲突解决](#git-conflicts)
- [7. 远程协作](#git-remote)
- [8. 历史追踪与定位](#git-history)
- [9. 撤销、恢复与救火](#git-undo)
- [10. 进阶工具](#git-advanced)
- [11. 速查表](#git-cheatsheet)

<a id="git-model"></a>
## 1. 心智模型

Git 最重要的不是命令数量，而是先分清几个对象：工作区、暂存区、本地仓库、远程仓库。

| 区域 | 本质 | 常见命令 | 你可以把它理解成 |
| --- | --- | --- | --- |
| 工作区 | 当前文件树 | `git status` `git diff` | 你正在改的文件 |
| 暂存区 | 索引 / 下一次提交的快照 | `git add` `git restore --staged` | 准备打包的清单 |
| 本地仓库 | 提交历史 | `git commit` `git log` | 本机的历史数据库 |
| 远程仓库 | 共享历史 | `git fetch` `git pull` `git push` | 团队共享的仓库 |

```text
工作区 --git add--> 暂存区 --git commit--> 本地仓库 --git push--> 远程仓库
   ^                      |                                 |
   |                      |                                 |
git restore        git restore --staged               git fetch / pull
```

> **注意：** Git 保存的是快照和引用，不是“魔法地保存文件”。很多误操作，本质上是没分清自己改的是哪一层。

<a id="git-config"></a>
## 2. 配置与初始化

### 2.1 `git config`：先把身份和偏好配好

第一次装完 Git，最先应该设置的是提交身份。

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Git 配置有作用域，后面的值会覆盖前面的同名值。

| 位置 | 命令 | 范围 |
| --- | --- | --- |
| `/etc/gitconfig` | `git config --system` | 整台机器 |
| `~/.gitconfig` 或 `~/.config/git/config` | `git config --global` | 当前用户 |
| `.git/config` | `git config --local` | 当前仓库 |

常用查询和修改：

```bash
git config --list --show-origin
git config --get user.name
git config --get-all alias.lg
git config --global --edit
git config --unset user.name
git config --unset-all alias.lg
git config --add alias.st status
git config --replace-all core.autocrlf input
```

常见而实用的配置：

| 配置项 | 作用 |
| --- | --- |
| `init.defaultBranch=main` | 新仓库默认主分支名 |
| `pull.rebase=true` | `git pull` 默认走 rebase |
| `fetch.prune=true` | 自动清理已删除的远程跟踪分支 |
| `push.default=simple` | 更安全的默认 push 行为 |
| `merge.conflictstyle=zdiff3` | 冲突时显示更多上下文 |
| `color.ui=auto` | 输出带颜色，便于阅读 |
| `core.autocrlf` | 行尾转换，团队要统一约定 |

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st status
git config --global alias.co checkout
```

> **提示：** 配置优先级通常是 `system < global < local`。如果同一个键在多个地方都存在，仓库级最优先。

### 2.2 `git init`：把目录变成仓库

```bash
git init
git init -b main
```

`git init` 会创建 `.git` 目录，里面保存对象、引用和配置。`-b` 可以直接指定初始分支名。

### 2.3 `git clone`：从远程复制仓库

```bash
git clone <repository-url>
git clone <repository-url> my-project
git clone --depth 1 <repository-url>
git clone --branch feature/login --single-branch <repository-url>
git clone --recurse-submodules <repository-url>
```

| 命令 | 含义 |
| --- | --- |
| `git clone <url>` | 克隆完整仓库 |
| `--depth 1` | 只拿浅历史，适合 CI 或快速查看 |
| `--branch` | 指定检出的分支 |
| `--single-branch` | 只拉指定分支相关历史 |
| `--recurse-submodules` | 顺手初始化子模块 |

> **注意：** 浅克隆会让 `git log`、`git bisect`、复杂回溯变得受限，不适合长期开发。

<a id="git-workflow"></a>
## 3. 修改、暂存与提交

### 3.1 路径参数怎么用

Git 里很多命令后面跟的是 pathspec，不只是“单个文件名”。

| 写法 | 含义 | 例子 |
| --- | --- | --- |
| `a b c` | 多个路径 | `git add a.txt b.txt` |
| `dir/` | 一个目录及其内容 | `git rm -r src/` |
| `.` | 当前目录及其下 | `git add .` |
| 留空 | 不是统一语义，很多命令不支持 | `git add` 不能当作“全部” |
| `-A` | 整个仓库的所有变化 | `git add -A` |
| `-u` | 只处理已跟踪文件的修改和删除 | `git add -u` |

> **提示：** `.` 不是“全仓库”的魔法开关，它只是当前目录。你在仓库根目录运行时，看起来才像“全仓库”。

### 3.2 `git status`：先看状态再动手

```bash
git status
git status -s
git status -sb
```

`-s` 是精简状态，`-b` 会额外显示当前分支。

| 标记 | 含义 |
| --- | --- |
| `??` | 未跟踪文件 |
| `M` | 已修改 |
| `A` | 已暂存新增 |
| `D` | 已删除 |
| `UU` | 冲突未解决 |

### 3.3 `git add`：把本次想提交的内容放进暂存区

```bash
git add file.txt
git add src/
git add .
git add -A
git add -u
git add -p
```

`git add -p` 很适合把一次大改拆成多个更干净的提交。每个 hunk 是一段连续改动，你可以按块决定要不要进暂存区。

| 按键 | 作用 |
| --- | --- |
| `y` | 暂存这个块 |
| `n` | 跳过这个块 |
| `s` | 把大块拆小 |
| `e` | 手动编辑这个块 |
| `q` | 退出 |
| `a` | 暂存后续所有块 |
| `d` | 跳过后续所有块 |
| `?` | 查看帮助 |

> **提示：** `-A` 更像“整个仓库都按当前状态入暂存区”，`-u` 更像“只刷新已跟踪文件的修改和删除”，`add .` 则受当前目录影响。

### 3.4 `git commit`：把暂存区写进历史

```bash
git commit -m "feat: support dark mode"
git commit -a -m "fix: tracked file changes"
git commit --amend
git commit --amend --no-edit
```

`-a` 只会自动加入**已跟踪文件**的修改，不会把新文件自动加进来。

`--amend` 的作用是改写最近一次提交。常见场景：

| 情况 | 建议 |
| --- | --- |
| 刚本地提交完，漏了文件或写错信息 | 直接 `--amend` |
| 已推送但没人依赖这笔提交 | 可以协商后再改，但要谨慎 |
| 这笔提交已经被别人基于它开了新分支 | 不要 amend，改用新提交或 `revert` |

> **注意：** 一旦别人已经拿这笔提交作为新分支起点，`amend` 就会改掉提交 SHA。你的分支和对方分支会从同一个祖先变成分叉历史，后续要额外 rebase 才能对齐。

### 3.5 `git rm`、`git mv`、`git clean`

```bash
git rm file.txt
git rm -r dir/
git rm --cached file.txt
git mv old.md new.md
git clean -n
git clean -fd
```

| 命令 | 作用 |
| --- | --- |
| `git rm file.txt` | 删除文件并记录删除 |
| `git rm --cached file.txt` | 取消跟踪，但保留工作区文件 |
| `git rm -r dir/` | 递归删除目录 |
| `git mv` | 移动或改名并保留历史关系 |
| `git clean -n` | 预览会删什么 |
| `git clean -fd` | 删除未跟踪文件和目录 |

> **注意：** `git clean` 只针对未跟踪文件，执行前最好先 `-n` 预览。

<a id="git-ignore"></a>
## 4. 忽略规则

### 4.1 `.gitignore`、`.git/info/exclude`、全局 ignore 的区别

| 机制 | 范围 | 是否入库 | 适合什么 |
| --- | --- | --- | --- |
| `.gitignore` | 当前仓库及子目录 | 是 | 团队共享规则 |
| `.git/info/exclude` | 只在本机当前仓库有效 | 否 | 个人临时文件 |
| `core.excludesFile` | 当前用户所有仓库 | 否 | 用户级通用噪音 |

`docs/tmp.md` 这种只想本地忽略的草稿，理论上更适合 `.git/info/exclude`；如果要所有协作者都忽略，才写进 `.gitignore`。

### 4.2 精准控制 `.gitignore`

| 规则 | 含义 | 例子 |
| --- | --- | --- |
| `node_modules/` | 忽略目录 | `node_modules/` |
| `*.log` | 忽略所有同类文件 | `error.log` |
| `/dist/` | 只忽略仓库根目录 | `/dist/` |
| `**/dist/` | 忽略所有层级的 dist | `src/a/dist/` |
| `!important.log` | 取消忽略 | `!important.log` |
| `\#name` | 忽略以 `#` 开头的真实文件 | `\#readme` |

常见技巧：

```gitignore
*.log
!important.log

build/*
!build/.gitkeep

*.env
!.env.example
```

> **提示：** 规则生效后，最实用的排查命令是 `git check-ignore -v <path>`，它会告诉你到底是哪个规则命中的。

这里的 `build/*` 比 `build/` 更适合配合 `!build/.gitkeep`。如果直接忽略整个目录，Git 会停止继续进入这个目录匹配后续规则，取消忽略里面的文件就容易失效。

如果你确实想把一个被忽略的文件强制纳入版本控制，可以用：

```bash
git add -f docs/tmp.md
```

### 4.3 已经被跟踪的文件怎么停掉

```bash
git rm --cached file.txt
git commit -m "chore: stop tracking generated file"
```

`.gitignore` 只能阻止**新**文件被跟踪，已经进过仓库的文件要先从索引里移除。

### 4.4 当你只想本地临时忽略

如果是你自己临时写的笔记、调试文件、导出文件，优先考虑：

```bash
git check-ignore -v docs/tmp.md
```

然后把规则写进 `.git/info/exclude` 或你的全局 ignore，而不是污染仓库级规则。

<a id="git-branching"></a>
## 5. 分支、合并与历史改写

Git 分支只是一个指向提交的引用。`main`、`feature/login` 本质上都是“指针名字”。

### 5.1 创建、查看、切换、删除分支

```bash
git branch
git branch -a
git branch -vv
git branch feature/login
git branch -m old-name new-name
git branch -d feature/login
git branch -D feature/login
git switch main
git switch -c feature/login
git switch --track origin/feature/login
```

| 命令 | 作用 |
| --- | --- |
| `git branch` | 查看本地分支 |
| `git branch -a` | 查看本地和远程分支 |
| `git branch -vv` | 看分支和上游跟踪关系 |
| `git switch` | 切换分支 |
| `git switch -c` | 创建并切换新分支 |
| `git branch -m` | 重命名本地分支 |
| `git branch -d/-D` | 删除分支 |

### 5.2 常见合并/整合方式对照

| 方式 | 命令 | 是否改写当前分支已有提交 | 是否保留分支结构 | 产物 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| 快进合并（FF） | `git merge` | 否 | 否 | 只移动分支指针 | 主分支没产生新提交 |
| 非快进合并（no-FF） | `git merge --no-ff` | 否 | 是 | 一个合并提交 | 想保留分支边界 |
| 压缩合并（squash） | `git merge --squash` | 否 | 否 | 一个普通提交 | 只想保留最终结果 |
| 变基（rebase） | `git rebase` | 是 | 否 | 一串新提交 | 整理个人分支 |
| 挑拣提交（cherry-pick） | `git cherry-pick` | 否 | 否 | 一个或多个新提交 | 热修复、回补到别的分支 |

```text
例子：feature 上有 C 和 D，main 上有 A 和 B

快进合并（FF）:
A--B--C--D

非快进合并（no-FF）:
A--B------M
      \   /
       C--D

压缩合并（squash）:
A--B--S

变基（rebase）:
A--B--C'--D'

挑拣提交（cherry-pick）:
A--B--C'
```

> **提示：** 上面几个方式最大的区别，就是“是否保留原始分支结构”和“是否改写已有提交 SHA”。

更准确地说，`cherry-pick` 会复制指定提交的改动并在当前分支上生成新提交，原来的提交不会被改写；`rebase` 才会把当前分支上的既有提交复制成新的提交，因此提交 SHA 会变化。

### 5.3 `git merge`：把一条开发线并回主线

```bash
git switch main
git merge feature/login
git merge --no-ff feature/login
git merge --squash feature/login
git merge --ff-only feature/login
```

`git merge` 会找共同祖先，尝试把两边的改动合在一起。

| 命令 | 说明 |
| --- | --- |
| `git merge feature/login` | 默认合并 |
| `--no-ff` | 即使可以快进，也强制保留合并提交 |
| `--ff-only` | 只允许快进，不能快进就失败 |
| `--squash` | 不直接生成合并提交，把结果压成一次提交 |

### 5.4 `git rebase`：重放提交，整理历史

```bash
git switch feature/login
git rebase main
git rebase -i HEAD~4
git rebase --onto main release/1.0 feature/login
```

`rebase` 的核心是：把当前分支的提交拿下来，重新放到另一个基底后面。

| 场景 | 用法 |
| --- | --- |
| 让个人分支跟上主线 | `git rebase main` |
| 调整最近几笔提交 | `git rebase -i HEAD~4` |
| 只搬运一段提交区间 | `git rebase --onto` |

`-i` 里常见指令：

| 指令 | 作用 |
| --- | --- |
| `pick` | 保留 |
| `reword` | 改提交信息 |
| `edit` | 暂停后手工修改 |
| `squash` | 合并到前一个提交 |
| `fixup` | 合并但不要保留信息 |
| `drop` | 删除这笔提交 |

> **注意：** `rebase` 会改写提交 SHA，公共分支上要非常谨慎。它最适合你的私有分支，或者团队约定好的整理阶段。

### 5.5 `git cherry-pick`：只搬一笔或几笔提交

```bash
git cherry-pick <commit-id>
git cherry-pick -x <commit-id>
git cherry-pick --no-commit <commit-id>
git cherry-pick <id1> <id2> <id3>
git cherry-pick A^..B
```

| 形式 | 用途 |
| --- | --- |
| 单个提交 | 精确回补一个修复 |
| 多个提交 | 一次搬运多个点 |
| `A^..B` | 把 A 到 B 这段连续提交都挑出来 |
| `-x` | 在提交信息里保留来源 SHA |
| `--no-commit` | 先把改动放进暂存区，不立刻提交 |

`cherry-pick` 常用于热修复回补到维护分支，或者把主分支上的某个修复单独带到发布分支。

<a id="git-conflicts"></a>
## 6. 冲突解决

冲突不是报错到没法处理，而是 Git 发现两边都改了同一块内容，它不知道该选哪边。

### 6.1 什么时候会冲突

- `merge`
- `rebase`
- `cherry-pick`
- `revert`
- `stash apply` / `stash pop`
- `pull --rebase`

### 6.2 怎么查看冲突

```bash
git status
git diff --name-only --diff-filter=U
git ls-files -u
```

| 命令 | 看到什么 |
| --- | --- |
| `git status` | 哪些文件未合并 |
| `git diff --name-only --diff-filter=U` | 冲突文件列表 |
| `git ls-files -u` | 索引里的三阶段条目 |

`git ls-files -u` 的三阶段含义：

| stage | 含义 |
| --- | --- |
| 1 | 共同祖先（base） |
| 2 | ours，当前分支一侧 |
| 3 | theirs，另一侧 |

如果你想快速选择一边，可以用：

```bash
git restore --ours path/to/file
git restore --theirs path/to/file
git add path/to/file
```

> **注意：** `ours` / `theirs` 在 `merge` 里比较直观；但在 `rebase` 时会更绕。rebase 是把你的提交重放到新基底上，`ours` 往往指新基底一侧，`theirs` 才是正在被重放的提交一侧。冲突复杂时，先打开文件看内容，比直接套命令更稳。

### 6.3 冲突文件里到底是什么

```text
<<<<<<< HEAD
当前分支的内容
=======
另一边的内容
>>>>>>> feature/login
```

你可以用任意文本编辑器在**工作区**直接修改冲突文件。常见做法是：

1. 打开冲突文件
2. 选择保留哪一边，或者手动合并两边内容
3. 删除 `<<<<<<<`、`=======`、`>>>>>>>` 这些标记
4. 保存文件
5. `git add` 这个文件，告诉 Git “我已经解决了”

### 6.4 冲突时各区状态

| 区域 | 状态 |
| --- | --- |
| 工作区 | 文件里有冲突标记，等待你手工改 |
| 暂存区 | 同一个路径可能有 stage 1/2/3 条目 |
| HEAD | 仍然是冲突前的当前分支提交 |

`git add` 在这里的意义不是“新增文件”，而是把你手工整理后的版本写回索引，让 Git 认为这个路径已经解决。

### 6.5 不同操作的收尾命令

| 操作 | 解决后下一步 |
| --- | --- |
| merge | `git add` 后 `git commit` |
| rebase | `git add` 后 `git rebase --continue` |
| cherry-pick | `git add` 后 `git cherry-pick --continue` |
| revert | `git add` 后 `git revert --continue` |
| stash apply/pop | `git add` 后按需要继续；`pop` 成功后再检查 stash 是否还保留 |

如果发现方向不对，可以中止当前操作：

| 操作 | 中止或跳过 |
| --- | --- |
| merge | `git merge --abort` |
| rebase | `git rebase --abort` 或 `git rebase --skip` |
| cherry-pick | `git cherry-pick --abort` 或 `git cherry-pick --skip` |
| revert | `git revert --abort` 或 `git revert --skip` |

`--abort` 是回到操作前；`--skip` 是放弃当前这一个提交，继续处理后面的提交。`--skip` 常见于 rebase 或 cherry-pick 队列中某个提交已经不需要了。

> **提示：** 如果你想让冲突更容易看清，可以把 `merge.conflictstyle` 设成 `zdiff3`，它会把共同祖先上下文也展示出来。

<a id="git-remote"></a>
## 7. 远程协作

### 7.1 远程地址、别名和查询

远程地址里的 `origin`、`upstream`、`fork` 这些名字只是别名，不是特殊语法。

| 概念 | 例子 | 含义 |
| --- | --- | --- |
| 远程别名 | `origin` `upstream` | 你给远程仓库起的名字 |
| 远程 URL | `https://...` | 真正地址 |
| 远程跟踪分支 | `origin/main` | 本地对远程分支的只读镜像 |
| 上游分支 | `origin/main` | 本地分支默认同步目标 |

```bash
git remote -v
git remote show origin
git remote get-url origin
git remote get-url --push origin
git branch -r
git branch -vv
```

### 7.2 远程地址的增删改查

```bash
git remote add origin <url>
git remote rename origin upstream
git remote set-url origin <new-url>
git remote set-url --push origin <push-url>
git remote remove origin
```

| 操作 | 命令 |
| --- | --- |
| 查 | `git remote -v` |
| 增 | `git remote add` |
| 改名 | `git remote rename` |
| 改 URL | `git remote set-url` |
| 单独改 push 地址 | `git remote set-url --push` |
| 删 | `git remote remove` |

### 7.3 本地分支和远程分支的对应关系

```bash
git push -u origin feature/login
git branch --set-upstream-to=origin/main main
git branch --unset-upstream
git fetch --prune
git push origin --delete feature/login
```

| 操作 | 命令 |
| --- | --- |
| 查询对应关系 | `git branch -vv` |
| 建立对应关系 | `git push -u` 或 `git branch --set-upstream-to` |
| 修改对应关系 | `git branch --set-upstream-to` |
| 取消对应关系 | `git branch --unset-upstream` |
| 删除远程分支 | `git push origin --delete <branch>` |
| 清理本地过期跟踪分支 | `git fetch --prune` |

### 7.4 `git fetch` 和 `git pull` 的区别

```text
fetch: 只把远程变化下载到本地远程跟踪分支，不动工作区和当前分支
pull : fetch + merge/rebase，把当前分支和它的上游整合起来
```

`git fetch` 默认会按远程的 fetch refspec 更新匹配到的远程跟踪分支，通常是 `origin/*`。它不会改你当前分支。

`git pull` 不是“把所有分支都合到当前分支”，它只会把**当前分支对应的上游**整合进来。别的远程分支如果也被下载了，只是更新了本地跟踪引用，不会自动合并进当前分支。

```bash
git fetch origin
git pull origin main
git pull --rebase origin main
git pull --ff-only
git pull --rebase --autostash origin main
```

| 需求 | 更适合的命令 |
| --- | --- |
| 只看远程更新，不碰当前分支 | `git fetch` |
| 直接把上游合进来 | `git pull` |
| 保持线性历史 | `git pull --rebase` |
| 只允许快进 | `git pull --ff-only` |

### 7.5 `git push` 和两个 force 参数

```bash
git push
git push -u origin feature/login
git push --force origin main
git push --force-with-lease origin main
```

| 参数 | 作用 | 风险 |
| --- | --- | --- |
| `--force` | 直接覆盖远程引用 | 高，可能覆盖别人刚推的内容 |
| `--force-with-lease` | 只有远程仍然是你预期的那个提交时才覆盖 | 相对安全 |

`--force-with-lease` 适合“我确认自己在重写历史，但希望先检查远程有没有被别人更新过”的场景。

<a id="git-history"></a>
## 8. 历史追踪与定位

### 8.1 `git log`：先看历史图

```bash
git log
git log --oneline
git log --oneline --graph --decorate --all
git log --author="Alice"
git log --since="2026-06-01"
git log -- path/to/file.md
git log --follow -- path/to/file.md
```

### 8.2 怎么拿到提交 ID

```bash
git log --oneline
git rev-parse HEAD
git rev-parse --short HEAD
git reflog
```

| 命令 | 作用 |
| --- | --- |
| `git log --oneline` | 直接看到 SHA 前缀 |
| `git rev-parse HEAD` | 当前 HEAD 的完整 SHA |
| `git rev-parse --short HEAD` | 当前 HEAD 的短 SHA |
| `git reflog` | 查看 HEAD 走过的历史 |

### 8.3 `HEAD~1`、`HEAD^` 这些表达式到底是什么

它们不是宏，而是 Git 的 revision 语法。

| 表达式 | 含义 |
| --- | --- |
| `HEAD` | 当前检出的提交或分支指向的提交 |
| `HEAD~1` | 沿第一父提交往回走 1 步 |
| `HEAD~3` | 沿第一父提交往回走 3 步 |
| `HEAD^` | 第一个父提交，通常等价于 `HEAD~1` |
| `HEAD^2` | 合并提交的第二个父提交 |
| `HEAD@{1}` | reflog 里的上一个 HEAD 位置 |
| `main@{u}` | `main` 的上游分支 |
| `ORIG_HEAD` | 某些危险操作前的备份引用 |
| `MERGE_HEAD` | 正在进行 merge 的另一端 |
| `REBASE_HEAD` | 正在进行 rebase 的当前目标 |
| `CHERRY_PICK_HEAD` | 正在进行 cherry-pick 的目标提交 |

### 8.4 `git diff`：比较差异

```bash
git diff
git diff --cached
git diff HEAD
git diff 分支一 分支二
git diff 分支一...分支二
git diff --name-only 分支一 分支二
git diff --stat 分支一 分支二
git diff --word-diff 分支一 分支二
git diff --check
```

| 写法 | 含义 | 建议 |
| --- | --- | --- |
| `git diff` | 工作区 vs 暂存区 | 看还没 `add` 的内容 |
| `git diff --cached` | 暂存区 vs HEAD | 看已经 `add` 的内容 |
| `git diff HEAD` | 工作区 + 暂存区 vs HEAD | 看总改动 |
| `git diff 分支一 分支二` | 两个分支直接比 | 最清楚，推荐写法 |
| `git diff 分支一...分支二` | 共同祖先到分支二 | 适合 review 或看某分支新增内容 |

> **提示：** `git diff main..feature/login` 这种写法容易让人联想到“范围”语法。教学和日常里更建议写成 `git diff main feature/login`，如果想看 merge-base 再用 `git diff main...feature/login`。

### 8.5 `git show` 和 `git blame`

```bash
git show <commit-id>
git show <commit-id> -- path/to/file
git blame path/to/file
git blame -L 20,40 path/to/file
```

`git show` 适合看一笔提交的完整内容；`git blame` 适合看某一行是谁引入的。

`git blame` 常用参数：

| 参数 | 作用 |
| --- | --- |
| `-L 20,40` | 只看指定行范围 |
| `-w` | 忽略空白变化 |
| `-M` | 追踪同文件内移动 |
| `-C` | 追踪从别的文件复制过来的行 |
| `-p` | 更适合机器阅读的详细格式 |
| `-e` | 显示邮箱 |
| `--ignore-rev <sha>` | 忽略某个格式化或搬迁提交 |
| `--ignore-revs-file <file>` | 批量忽略某些提交 |

> **提示：** `blame` 更像“查上下文”，不是“找人背锅”。通常是先用 `blame` 找到提交，再用 `show` 看这个提交为什么这么改。

<a id="git-undo"></a>
## 9. 撤销、恢复与救火

### 9.1 `git restore`：处理工作区和暂存区

```bash
git restore file.txt
git restore --staged file.txt
git restore --source=HEAD~1 file.txt
git restore --source=HEAD~1 --staged --worktree file.txt
```

| 命令 | 作用 |
| --- | --- |
| `git restore file.txt` | 丢弃工作区修改 |
| `git restore --staged file.txt` | 让暂存区里的这个文件恢复到 `HEAD` 的版本，工作区内容保留 |
| `git restore --source=<commit> file.txt` | 从指定提交恢复内容 |

`git restore` 不会移动 `HEAD`，所以它适合“只想撤文件，不想动历史”。

换句话说，`git restore --staged file.txt` 不是把内容“搬回工作区”，而是取消这次暂存。文件在工作区里仍然保持你修改后的样子，只是不再属于下一次提交。

### 9.2 `git reset`：移动分支指针

```bash
git reset --soft <commit-id>
git reset --mixed <commit-id>
git reset --hard <commit-id>
```

| 模式 | HEAD | 暂存区 | 工作区 | 适合什么 |
| --- | --- | --- | --- | --- |
| `--soft` | 回退 | 保留 | 保留 | 想重写最近提交，但保留改动 |
| `--mixed` | 回退 | 重置 | 保留 | 想取消暂存并重组提交 |
| `--hard` | 回退 | 重置 | 重置 | 想彻底回到某个提交 |

```text
--soft  只动 HEAD
--mixed 动 HEAD 和暂存区
--hard  动 HEAD、暂存区、工作区
```

> **注意：** `reset --hard` 会直接丢工作区内容。只在你确定不要这些改动时使用。

### 9.3 `git revert`：用一笔新提交抵消旧提交

```bash
git revert <commit-id>
git revert -n <commit-id>
git revert -m 1 <merge-commit-id>
git revert --continue
git revert --abort
```

| 场景 | 做法 |
| --- | --- |
| 撤销普通提交 | `git revert <commit-id>` |
| 先批量撤销，再统一提交 | `git revert -n` |
| 撤销合并提交 | `git revert -m 1 <merge-commit-id>` |

`revert` 不改历史，而是追加一个“反向提交”。这就是为什么它特别适合公共分支。

撤销合并提交时，`-m` 是 mainline 的意思，也就是告诉 Git “以哪个父提交作为主线”。一个 merge commit 至少有两个父提交：

| 参数 | 含义 |
| --- | --- |
| `-m 1` | 保留第一个父提交一侧，撤销合并进来的另一侧改动 |
| `-m 2` | 保留第二个父提交一侧，撤销第一侧带来的改动 |

常见主分支上撤销功能分支合并，一般是 `git revert -m 1 <merge-commit-id>`，因为第一个父提交通常是主分支原来的历史。这个操作会留下“这个功能分支的改动已经被反向抵消”的历史痕迹；未来如果再合并同一个分支，Git 可能认为那些提交已经合并过。更稳的做法通常是从新分支重新提交需要恢复的改动。

### 9.4 `git stash`：临时收起当前工作

```bash
git stash push -m "wip: temp notes"
git stash push -p
git stash push -u
git stash push -a
git stash push --keep-index
git stash list
git stash show -p stash@{0}
git stash apply stash@{0}
git stash pop
git stash drop stash@{0}
git stash clear
git stash branch temp-work stash@{0}
```

| 命令 | 作用 |
| --- | --- |
| `push` | 把当前改动收进栈里 |
| `push -u` | 同时收起未跟踪文件 |
| `push -a` | 同时收起未跟踪文件和被忽略文件 |
| `push -p` | 交互式选择要收起的改动 |
| `push --keep-index` | 收起工作区中未暂存的部分，保留暂存区 |
| `list` | 查看 stash 列表 |
| `show -p` | 看 stash 里面改了什么 |
| `apply` | 恢复但不删除 stash |
| `pop` | 恢复并删除 stash |
| `drop` | 删除某条 stash |
| `clear` | 清空所有 stash |
| `branch` | 从 stash 新建一个分支 |

`stash` 很适合和 `switch`、`pull`、`rebase` 配合：

- 先 `stash`
- 切分支或同步上游
- 再 `pop` 或 `apply`

如果恢复时冲突，处理方式和 merge 类似：解决文件、`git add`、再继续后续步骤。

默认 `git stash push` 只会收起已跟踪文件的改动，不会收未跟踪文件。临时新建的文件也要收起来时，用 `-u`；连 `.gitignore` 忽略的产物都要收起来时，用 `-a`，但这个很少需要。

`--keep-index` 的一个典型用法是：你已经用 `git add -p` 暂存了准备提交的干净部分，但工作区里还有别的半成品。此时可以 `git stash push --keep-index`，先只测试和提交暂存区里的内容，之后再 `git stash pop` 把半成品拿回来。

### 9.5 `git reflog`：最后的后悔药

```bash
git reflog
git reset --hard HEAD@{1}
```

`reflog` 记录的是 `HEAD` 和分支引用移动过的历史。你就算把分支删了、`reset` 过头了，通常还是能从里面把引用找回来。

> **提示：** 如果你做了危险操作，先去看 `reflog`，再决定要不要 `reset` 回去，比盲猜安全得多。

<a id="git-advanced"></a>
## 10. 进阶工具

### 10.1 `git tag`：给版本打标签

```bash
git tag
git tag -l "v1.*"
git tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git show v1.0.0
git tag -d v1.0.0
git push origin v1.0.0
git push origin --tags
git push origin --delete v1.0.0
git fetch --tags
```

| 操作 | 命令 |
| --- | --- |
| 查 | `git tag` `git tag -l` |
| 看 | `git show <tag>` |
| 增 | `git tag <name>` `git tag -a <name> -m ...` |
| 删本地 | `git tag -d <name>` |
| 删远程 | `git push origin --delete <name>` |
| 推送全部 tag | `git push origin --tags` |

轻量 tag 只是一个名字；annotated tag 会保存作者、时间和说明。发布版本更推荐 annotated tag。

> **注意：** tag 一般当作“版本刻度”使用，最好不要随便改名改内容。要改时通常是删掉重建。

### 10.2 `git submodule`：把另一个仓库挂进来

```bash
git submodule add <repository-url> vendor/lib
git submodule status
git submodule update --init --recursive
git submodule foreach git pull --ff-only
git submodule deinit -f vendor/lib
git rm -f vendor/lib
```

子模块会在父仓库里记录一个固定提交 SHA。它的常见流程是：

1. 在子模块仓库里更新并提交
2. 回到父仓库，把子模块指针更新到新的 SHA
3. 提交父仓库的指针变化

这和普通目录不一样，父仓库不会自动跟着子仓库的最新分支跑。

### 10.3 `git bisect`：二分法找出引入 Bug 的提交

```bash
git bisect start
git bisect bad
git bisect good <good-commit>
git bisect skip
git bisect reset
git bisect run pnpm test
```

| 命令 | 作用 |
| --- | --- |
| `start` | 开始二分 |
| `good` | 标记好版本 |
| `bad` | 标记坏版本 |
| `skip` | 当前提交无法判断时跳过 |
| `reset` | 退出 bisect |
| `run` | 自动跑测试脚本 |

`git bisect run` 脚本里，通常 `0` 表示好，`1` 表示坏，`125` 表示跳过当前提交。

### 10.4 Git Hooks：把检查前置到提交前

常见 hook：

| Hook | 触发时机 | 常见用途 |
| --- | --- | --- |
| `pre-commit` | 提交前 | 格式化、lint、静态检查 |
| `commit-msg` | 写提交信息时 | 检查提交格式 |
| `pre-push` | 推送前 | 跑测试、阻止坏代码上远程 |
| `post-merge` | 合并后 | 做一些同步动作 |
| `post-checkout` | 切分支后 | 更新本地生成文件 |

hooks 默认放在 `.git/hooks`，但那里的脚本通常不会被仓库版本化。团队如果要共享 hooks，常见做法是设置 `core.hooksPath` 指向一个可提交目录。

### 10.5 `git worktree`：同一个仓库同时开多个工作区

`worktree` 很适合“当前分支写到一半，又要马上切去修另一个 bug”的情况。它不会强迫你 stash 当前工作，而是在同一个仓库历史上额外挂一个工作目录。

```bash
git worktree list
git worktree add ../repo-hotfix main
git worktree add -b hotfix/login ../repo-hotfix origin/main
git worktree remove ../repo-hotfix
git worktree prune
```

| 命令 | 作用 |
| --- | --- |
| `git worktree list` | 查看所有工作区 |
| `git worktree add <path> <branch>` | 在指定路径检出一个分支 |
| `git worktree add -b <new> <path> <start>` | 从某个起点创建新分支并检出 |
| `git worktree remove <path>` | 删除额外工作区 |
| `git worktree prune` | 清理已经不存在的工作区记录 |

和 `stash` 的区别：

| 场景 | 更适合 |
| --- | --- |
| 临时收起一点改动，马上回来 | `git stash` |
| 要同时保留两个独立工作目录 | `git worktree` |
| 修 bug 的同时原分支还要保留编辑器状态 | `git worktree` |

> **注意：** 同一个本地分支通常不能被两个 worktree 同时检出。需要并行开发时，给另一个 worktree 新建分支更清楚。

### 10.6 `git rerere`：记住你解决过的冲突

`rerere` 是 reuse recorded resolution 的缩写。它会记录你怎么解决过某类冲突，下次遇到相同冲突时自动套用之前的解决结果。

```bash
git config --global rerere.enabled true
git rerere status
git rerere diff
git rerere forget path/to/file
git rerere gc
```

| 命令 | 作用 |
| --- | --- |
| `rerere.enabled=true` | 开启冲突解决记录 |
| `git rerere status` | 查看当前哪些文件被 rerere 记录 |
| `git rerere diff` | 查看 rerere 套用的解决结果 |
| `git rerere forget <path>` | 忘掉某个文件的记录 |
| `git rerere gc` | 清理过期记录 |

它特别适合长期功能分支反复 rebase、或者维护多个发布分支时重复解决同一类冲突。第一次还是要你手动解决，后续才会复用。

### 10.7 `git grep`：在仓库里查内容

`git grep` 只查 Git 认识的文件，速度快，也不会默认扫进 `node_modules`、构建产物这类噪音。

```bash
git grep "TODO"
git grep -n "useEffect"
git grep -i "login"
git grep -l "fetchUser"
git grep "oldName" -- "*.ts" "*.tsx"
git grep "api" HEAD~3
```

| 参数 | 作用 |
| --- | --- |
| `-n` | 显示行号 |
| `-i` | 忽略大小写 |
| `-l` | 只列文件名 |
| `-- <pathspec>` | 限定路径或文件类型 |
| `<revision>` | 在某个提交或分支里搜索 |

如果只是查当前仓库代码，`git grep` 经常比普通 `grep` 更少噪音；如果要查未跟踪文件，还是用编辑器搜索或 `rg` 更合适。

### 10.8 `git commit --fixup` 和 `git rebase --autosquash`

当你在 code review 后要修前面某个提交，`fixup` 比“新建一个 fix typo 提交，最后手动 squash”更顺。

```bash
git log --oneline
git commit --fixup <commit-id>
git rebase -i --autosquash <base>
```

流程是：

1. 找到要修正的目标提交 ID
2. 修改代码并 `git add`
3. `git commit --fixup <commit-id>`
4. `git rebase -i --autosquash <base>`
5. Git 会自动把 fixup 提交排到目标提交后面，并标成 `fixup`

常见例子：

```bash
git commit --fixup abc1234
git rebase -i --autosquash origin/main
```

> **提示：** 这个功能适合整理个人分支提交。和普通 rebase 一样，如果分支已经被别人依赖，要先沟通再改写历史。

### 10.9 `git range-diff`：比较两组提交

`range-diff` 很适合看“我 rebase 前后的提交系列到底变了什么”。普通 `diff` 更关注最终文件差异，`range-diff` 更关注提交序列之间的对应关系。

```bash
git range-diff origin/main..feature-old origin/main..feature-new
git range-diff main@{1}..feature main..feature
```

| 场景 | 用法 |
| --- | --- |
| rebase 后自查提交变化 | `git range-diff old-base..old-tip new-base..new-tip` |
| review 一组补丁是否只是整理过 | 比较旧分支范围和新分支范围 |
| 检查 fixup/squash 后有没有丢内容 | 和 rebase 前的范围对比 |

它的输出会按提交配对，告诉你哪些提交相同、哪些被重写、哪些新增或删除。写复杂 PR 时，这个命令比单纯看最终 diff 更能发现“整理历史时漏了提交”的问题。

### 10.10 `git describe`：从 tag 推导版本号

`describe` 会从当前提交往回找最近的 tag，并生成一个可读版本描述。

```bash
git describe --tags
git describe --tags --always
git describe --tags --dirty
```

输出可能像这样：

```text
v1.2.0-5-gabc1234
```

含义是：当前提交距离 `v1.2.0` 这个 tag 之后有 5 个提交，当前短 SHA 是 `abc1234`。

| 参数 | 作用 |
| --- | --- |
| `--tags` | 使用轻量 tag 和 annotated tag |
| `--always` | 没有 tag 时退回到短 SHA |
| `--dirty` | 工作区不干净时追加 dirty 标记 |

这个命令很适合放进构建脚本里生成版本号，比如 CLI 的 `--version`、前端页面的构建信息、后端服务的启动日志。

### 10.11 `git sparse-checkout`：大仓库只检出一部分

大仓库里你只需要某几个目录时，可以用 sparse checkout 减少工作区体积。

```bash
git clone --filter=blob:none --sparse <repository-url>
cd repo
git sparse-checkout set frontend docs
git sparse-checkout list
git sparse-checkout add scripts
git sparse-checkout disable
```

| 命令 | 作用 |
| --- | --- |
| `--sparse` | 克隆后启用稀疏检出 |
| `set <paths>` | 设置只检出的目录或文件 |
| `add <paths>` | 在现有范围上追加 |
| `list` | 查看当前规则 |
| `disable` | 恢复完整工作区 |

它适合 monorepo 或超大项目。注意它改变的是工作区可见文件，不代表仓库历史不存在；需要和构建脚本、IDE 配置配合好。

### 10.12 `git archive`：导出干净源码包

`archive` 可以从某个提交、分支或 tag 导出一份不带 `.git` 目录的源码包。

```bash
git archive --format=zip --output=release.zip HEAD
git archive --format=tar --prefix=myapp/ v1.0.0 > myapp.tar
```

| 参数 | 作用 |
| --- | --- |
| `--format=zip` | 导出 zip |
| `--format=tar` | 导出 tar |
| `--output=<file>` | 指定输出文件 |
| `--prefix=<dir>/` | 给压缩包内容加一层目录 |

它适合发源码包、交作业、给别人一份干净快照。它不会包含未提交文件，也不会包含 `.git` 历史。

<a id="git-cheatsheet"></a>
## 11. 速查表

### 11.1 常见任务对应的命令

| 你想做什么 | 先看什么 |
| --- | --- |
| 看当前状态 | `git status -sb` |
| 看未暂存差异 | `git diff` |
| 看已暂存差异 | `git diff --cached` |
| 暂存部分内容 | `git add -p` |
| 恢复文件内容 | `git restore` |
| 回退提交但保留改动 | `git reset --soft` |
| 安全撤销已发布提交 | `git revert` |
| 切换分支 | `git switch` |
| 让个人分支跟上主线 | `git rebase main` |
| 只拿一个修复 | `git cherry-pick <sha>` |
| 同步远程但不改当前分支 | `git fetch` |
| 同步并整合上游 | `git pull` |
| 推送本地历史 | `git push` |
| 同时开两个工作目录 | `git worktree` |
| 复用冲突解决结果 | `git rerere` |
| 在仓库中搜索内容 | `git grep` |
| 自动整理修补提交 | `git commit --fixup` + `git rebase --autosquash` |
| 比较两组提交 | `git range-diff` |
| 从 tag 推导版本号 | `git describe` |
| 大仓库只检出部分目录 | `git sparse-checkout` |
| 导出干净源码包 | `git archive` |

### 11.2 如果你只记三件事

1. 先看 `git status`，再决定下一步。
2. 区分 `restore`、`reset`、`revert`：文件级恢复、历史回退、历史反向提交不是一回事。
3. 公共分支上不要随便改写历史，`rebase`、`amend`、`force push` 都要先想清楚别人是否已经依赖这笔提交。

如果把这篇文章串起来看，Git 的主线其实很简单：先配置好，再用 `status -> add -> commit` 形成日常闭环，遇到分支就用 `switch/merge/rebase/cherry-pick`，遇到远程就用 `fetch/pull/push`，出问题再用 `restore/reset/revert/stash/reflog` 收尾。
