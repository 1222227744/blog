---
title: MinGW64 编译流程速记：从单文件到库文件
published: 2025-04-30
updated: 2026-04-24
description: 基于原始笔记重排 MinGW64 的常见编译命令，按单文件、多文件、静态库、动态库和调试流程拆开说明。
tags: ["MinGW64", "GCC", "G++", "C++", "构建"]
category: C++
lang: zh_CN
draft: false
---

MinGW64 的命令并不多，但如果不按阶段整理，很容易记混。这篇文章把常见场景分成五类：直接编译、分阶段构建、生成静态库、生成动态库，以及调试准备。

## 1. 直接编译单文件

这是最常见的入门场景，适合只有一个源文件的小程序。

```bash
gcc main.c -o main.exe
g++ main.cpp -o main.exe
```

区别很直接：

- `gcc` 通常用于 C
- `g++` 通常用于 C++
- `-o` 用来指定输出文件名

## 2. 编译多文件

当项目拆成多个源文件后，可以在一次命令里把它们全部交给编译器：

```bash
g++ src1.cpp src2.cpp src3.cpp -o project.exe
```

这种写法适合小项目。文件继续增多以后，更推荐交给 `Makefile`、CMake 或其他构建系统管理。

## 3. 静态库的基本做法

静态库会在链接阶段被直接打包进最终可执行文件。

```bash
g++ -c math.cpp -o math.o
ar rcs libmath.a math.o
```

可以把它拆成两个动作理解：

1. `g++ -c` 只编译，不链接，得到目标文件 `math.o`
2. `ar rcs` 把目标文件打包成静态库 `libmath.a`

后续如果要链接这个静态库，再把 `.a` 文件交给链接阶段即可。

## 4. 动态库的基本做法

动态库会在运行时加载，Windows 下常见产物是 `.dll`。

```bash
g++ -fPIC -c math.cpp -o math.o
g++ -shared -o libmath.dll math.o
```

这里要记住两个关键词：

- `-fPIC`：生成位置无关代码，便于做共享库
- `-shared`：告诉编译器产出的是动态库

## 5. 理清编译的四个阶段

很多“命令太多”的困惑，本质上是没把编译流程拆开。一个典型的 C++ 构建过程可以分成下面四步。

### 预处理

```bash
g++ -E main.cpp -o main.i
```

输出的是预处理后的中间文件，适合查看宏展开和头文件包含结果。

### 编译

```bash
g++ -S main.i -o main.s
```

这一阶段会把代码编译成汇编。

### 汇编

```bash
g++ -c main.s -o main.o
```

把汇编文件转成目标文件。

### 链接

```bash
g++ main.o -o main.exe
```

把目标文件和所需库链接起来，最终得到可执行文件。

## 6. 调试时至少补上这两步

原始笔记里调试部分只有标题，我这里补上最常用的一套最小流程。

先带调试信息编译：

```bash
g++ -g main.cpp -o main.exe
```

再用 `gdb` 启动：

```bash
gdb ./main.exe
```

如果只是刚开始接触命令行调试，先记住这三个动作就够用：

- `break main`：在 `main` 函数打断点
- `run`：开始运行
- `next`：单步执行

## 7. 一张够用的速查表

| 场景 | 命令骨架 |
| --- | --- |
| 单文件编译 | `g++ main.cpp -o main.exe` |
| 多文件编译 | `g++ a.cpp b.cpp -o app.exe` |
| 只生成目标文件 | `g++ -c file.cpp -o file.o` |
| 静态库 | `ar rcs libxxx.a xxx.o` |
| 动态库 | `g++ -shared -o libxxx.dll xxx.o` |
| 预处理 | `g++ -E main.cpp -o main.i` |
| 编译为汇编 | `g++ -S main.i -o main.s` |
| 汇编为目标文件 | `g++ -c main.s -o main.o` |
| 调试编译 | `g++ -g main.cpp -o main.exe` |

如果你能把“预处理 -> 编译 -> 汇编 -> 链接”这条主线记牢，MinGW64 的很多命令其实都只是这条流程的不同入口。
