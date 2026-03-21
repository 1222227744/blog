---
title: 复变函数学习笔记（一）：复数、辐角与欧拉公式
published: 2026-03-22
description: 把复变函数入门中的核心定义和常用公式整理成一页可复习的速记笔记。
image: ""
tags: [数学, 复变函数, 学习笔记]
category: 数学
draft: false
lang: zh_CN
---

> 本文由个人课堂笔记整理，重点是「可快速回看」而不是完整教材推导。

## 前置知识

### 欧拉公式

$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

$$
r e^{i\theta} = r(\cos\theta + i\sin\theta)
$$

### 欧拉公式的特殊形式

$$
\text{当 } \theta = \pi \text{ 时，} e^{i\pi} + 1 = 0
$$

这里可以联想到 $\theta$ 的几何意义：旋转角度。

### 复平面

把 $3 + 4i$ 看作点 $(3,4)$，即把复数与平面向量对应起来。

## 第一章：复数基础

### 共轭复数

设 $z = 3 + 4i$，则 $\bar{z} = 3 - 4i$。

常用结论：

1. $z + \bar{z} = 2\operatorname{Re}z$
2. $z - \bar{z} = 2i\operatorname{Im}z$
3. $z \cdot \bar{z} = |z|^2$
4. $\overline{z_1 + z_2} = \bar{z}_1 + \bar{z}_2,\quad \overline{z_1 - z_2} = \bar{z}_1 - \bar{z}_2$
5. $\overline{z_1 z_2} = \bar{z}_1 \bar{z}_2,\quad \overline{\left(\frac{z_1}{z_2}\right)} = \frac{\bar{z}_1}{\bar{z}_2} \quad (z_2 \neq 0)$

### 主辐角

主辐角记作 $\arg z$，满足 $\arg z \in (-\pi,\pi]$，并且唯一。

若 $z = x + yi$，主辐角可按象限计算：

1. 第一、四象限：$\theta = \arctan\frac{y}{x}$
2. 第二象限：$\theta = \arctan\frac{y}{x} + \pi$
3. 第三象限：$\theta = \arctan\frac{y}{x} - \pi$

### 辐角

辐角记作 $\operatorname{Arg}z$，满足：

$$
\operatorname{Arg}z = \arg z + 2k\pi,\quad k \in \mathbb{Z}
$$

所以辐角不唯一。

### 复数的三种表示

$$
\begin{cases}
\text{代数形式：}x + yi \\
\text{三角形式：}r(\cos\theta + i\sin\theta) \\
\text{指数形式：}re^{i\theta}
\end{cases}
$$

其中 $r$ 是模长，$\theta$ 是辐角。

### 复数的乘除

核心规则：模长相乘（或相除），辐角相加（或相减）。

$$
r_1e^{i\theta_1}\cdot r_2e^{i\theta_2} = r_1r_2e^{i(\theta_1+\theta_2)}
$$

$$
\frac{r_1e^{i\theta_1}}{r_2e^{i\theta_2}} = \frac{r_1}{r_2}e^{i(\theta_1-\theta_2)} \quad (r_2 \neq 0)
$$

### 复数乘幂

$$
z^n = r^n e^{in\theta} = r^n\bigl(\cos(n\theta) + i\sin(n\theta)\bigr)
$$

### De Moivre（棣莫弗）公式

$$
(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)
$$

### 复数的 $n$ 次根

复数开 $n$ 次方一般有 $n$ 个解：

$$
z^{1/n} = r^{1/n} e^{i(\theta + 2k\pi)/n},\quad k = 0,1,\dots,n-1
$$
