---
title: Linux 命令行入门：目录、文件与文本处理
published: 2025-03-19
updated: 2026-04-24
description: 把常见的 Linux 基础命令按使用场景重新整理，适合作为刚开始接触终端时的速查表。
tags: ["Linux", "CLI", "命令行", "效率工具"]
category: Linux
lang: zh_CN
draft: false
---

这篇文章整理的是最常用的一组 Linux 基础命令。相比零散地背命令，我更推荐按“我现在要做什么”来记：先定位目录，再处理文件，最后做搜索、过滤和重定向。

## 1. 先熟悉目录导航

这部分解决的是“我在哪”“我要去哪里”“目录里有什么”。

| 目标 | 命令 | 说明 |
| --- | --- | --- |
| 查看当前位置 | `pwd` | 输出当前工作目录 |
| 列出目录内容 | `ls` | 常配合 `-a`、`-l`、`-h` 使用 |
| 切换目录 | `cd 路径` | 不带参数时默认回到 `~` |
| 创建目录 | `mkdir 路径` | 配合 `-p` 可以一次创建多层目录 |

常见写法：

```bash
ls -la
cd ~/projects
mkdir -p demo/src/components
pwd
```

几个必须认识的特殊路径：

- `.` 表示当前目录
- `..` 表示上一级目录
- `../..` 表示上两级目录
- `~` 表示当前用户的 Home 目录

## 2. 文件操作是第二步

目录找对之后，下一步通常就是创建、查看、复制、移动或删除文件。

| 操作 | 命令 | 常见用法 |
| --- | --- | --- |
| 创建空文件 | `touch` | `touch notes.txt` |
| 查看完整内容 | `cat` | 适合短文件 |
| 分页查看内容 | `more` | 空格翻页，`q` 退出 |
| 复制文件或目录 | `cp` | 复制目录时加 `-r` |
| 移动或重命名 | `mv` | 目标不存在时等价于改名 |
| 删除文件或目录 | `rm` | 删除目录时加 `-r` |

示例：

```bash
touch app.log
cat app.log
cp config.yaml config.backup.yaml
mv draft.md post.md
rm old.txt
rm -r old-folder
```

> [!warning]
> `rm` 是高风险命令，尤其是 `rm -r` 和 `rm -rf`。执行前先确认路径，不要在不确定当前位置时直接删除。

## 3. 查找、过滤和统计

当文件变多时，终端最有价值的能力就是“找得到”和“筛得快”。

### `which`：查命令本体在哪里

```bash
which git
which python
```

### `find`：按文件名或大小查找

```bash
find . -name "package.json"
find . -size +10M
find /var/log -name "*.log"
```

常见含义：

- `-name` 按名字查找
- `-size +10M` 查找大于 10MB 的文件
- `+` 表示大于，`-` 表示小于

### `grep`：按关键字过滤内容

```bash
grep "TODO" README.md
grep -n "error" app.log
```

如果关键字里有空格或特殊符号，建议用引号包起来。

### `wc`：快速做统计

```bash
wc -l app.log
wc -w article.md
wc -c image-info.txt
```

常用参数：

- `-l` 统计行数
- `-w` 统计单词数
- `-c` 统计字节数
- `-m` 统计字符数

## 4. 管道、重定向和输出

这一组命令可以把多个简单动作串成一个工作流。

### 管道符 `|`

把左边命令的输出，作为右边命令的输入：

```bash
cat app.log | grep -n "error"
ls -la | more
```

### `echo`

```bash
echo "hello linux"
```

### 反引号 `` `...` ``

反引号里的内容会先作为命令执行，再把结果放回原位置：

```bash
echo `pwd`
```

如果是日常脚本，我更建议使用可读性更好的 `$(...)` 形式，但记住反引号的含义仍然有帮助。

### 重定向 `>` 和 `>>`

```bash
echo "first line" > notes.txt
echo "second line" >> notes.txt
```

- `>` 覆盖写入
- `>>` 追加写入

## 5. 查看日志和切换用户

### `tail`

看文件结尾内容时非常高频，尤其是日志：

```bash
tail app.log
tail -20 app.log
tail -f app.log
```

- 默认显示最后 10 行
- `-20` 表示显示最后 20 行
- `-f` 表示持续跟踪更新

### `su`

```bash
su - root
su - username
```

- `-` 表示切换后同时加载目标用户的环境变量
- 不写用户名时，通常表示切换到 `root`
- 切换后可以用 `exit` 或 `Ctrl + D` 退出

## 6. 一条适合新手的记忆顺序

如果只想先掌握最常用的一批命令，我建议按下面顺序练习：

1. `pwd`、`ls`、`cd`
2. `mkdir`、`touch`
3. `cat`、`more`
4. `cp`、`mv`、`rm`
5. `grep`、`find`、`wc`
6. `|`、`>`、`>>`、`tail -f`

当你开始把这些命令组合起来使用，终端就不再只是“黑框框”，而是一个很高效的文件和文本处理工具。
