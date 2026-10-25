---
title: Sinkhorn distance
description: A derivation of dual Sinkhorn distances for entropy-regularized optimal transport, using Lagrange multipliers.
---

# Sinkhorn distance

This post focuses on the derivation of (dual) Sinkhorn distances introduced in the paper [Sinkhorn Distances: Lightspeed Computation of Optimal Transportation Distances](https://arxiv.org/abs/1306.0895). The algorithm is the matrix decomposition using Sinkhorn iterations that was covered in the previous post.

---

## 0. The problem

The problem is to learn an assignment from probability distribution `r` to a probability distribution `c` with the lowest cost. The cost of an assignment `i → j` is given by $M_{ij}$. The matrix $M$ is a cost matrix. This assignment can be described by a joint probability distribution given by a matrix $P$ whose rows sum to $r$ and whose columns sum to $c$. Thus the total cost for a given assignment is given by $\langle P, M \rangle$. Both matrices have a shape of $\mathbb{R}^{n \times n}$.

This is a linear programming problem with a complexity of $\mathcal{O}(n^3\log(n))$. The paper introduces a regularization term to turn it into a convex optimization problem: $P$ needs to have entropy at least $h(r) + h(c) - \alpha$, where $\alpha$ is a regularization parameter.

It can be shown that when $M$ lies in the cone of distance matrices, the regularized metric is a valid distance.

---

## 1. (Dual) Sinkhorn distances

In practice however, it is still not fast enough to solve the regularized problem. A "dual" version of the regularized problem is introduced which has a nice solution:

> Given `r,c` and `M`, find `P` that minimizes $\langle P, M \rangle - \frac{h(P)}{\lambda}$ where $\lambda$ is a regularization parameter.

This expression has a nice solution as we will see below.

---

## 2. Derivation based on Lagrange multipliers

We have the following Lagrangian:

$$\begin{aligned} \mathcal{L}(P, \alpha, \beta) &= \sum_{ij} (\frac{1}{\lambda} p_{ij} m_{ij} + p_{ij}m_{ij}) + \alpha^T (P1^d - r) + \beta^T (P^T 1^d - c) \\ \Rightarrow \frac{\partial \mathcal{L}}{\partial p_{ij}} &= \frac{1}{\lambda}(1 + \log(p_{ij})) + m_{ij} + \alpha_i + \beta_j \\ \Rightarrow p_{ij}^{\lambda} &= \textcolor{#e11d48}{e^{-\frac{1}{2} - \lambda \alpha_i}} \ e^{-\lambda m_{ij}} \ \textcolor{#b45309}{e^{-\frac{1}{2} - \lambda \beta_j}} \\ \Rightarrow P^{\lambda} &= \textcolor{#e11d48}{\text{diag}(u)} \ e^{-\lambda M} \ \textcolor{#b45309}{\text{diag}(v)} \end{aligned}$$

How do we determine the diagonal matrices $u$ and $v$? We use Sinkhorn-Knopp iteration to alternately scale the rows and columns of $P^{\lambda}$ until the row and column sums are equal to $r$ and $c$ respectively.

You can check out the official implementation [here](https://github.com/PythonOT/POT/blob/bc5fc11461d31648da0c38b864fbc67c07fcaf16/ot/bregman/_sinkhorn.py).

---

[← Matrix scaling](/series/permutation_sinkhorn/6_matrix_scaling)
