---
title: A simpler derivation of continuous normalizing flows and its interpretation
---

# A simpler derivation of continuous normalizing flows and its interpretation

Continuous normalizing flow (CNF) is a type of normalizing flow that uses a continuous, differentiable function to transform a probability distribution. My first encounter with CNF was in the paper [Neural ODEs](https://arxiv.org/abs/1806.07366) by Chen, et al. `Theorem 1` in the paper states that:

> Let $z(t)$ be a finite continuous random variable with probability $p(z(t))$ dependent on time. Let $dz/dt = f(z(t), t)$ be a differential equation describing a continuous-in-time transformation of $z(t)$. Assuming that $f$ is uniformly Lipschitz continuous in $z$ and continuous in $t$, then the change in log probability also follows a differential equation:
>
> $$\frac{\partial \log(p(z(t)))}{\partial t} = -\text{tr}\left(\frac{\partial f}{\partial z(t)}\right)$$

The proof is given in `Appendix A` but is not easy to follow. Here I will present a proof which is much simpler (in my opinion). Lastly I want to talk about an elegant interpretation of this expression.

---

## 0. Prerequisites

The first thing you need to know is the formula which relates the probability density of a transformed variable by a function $f$ to the probability density of the input $x$:

$$p(x) = p(y) \times \lvert \det(\partial y / \partial x) \rvert$$

We will use the following facts for first order approximation:

1. $d(\det(I_n + dX)) = \text{tr}(dX)$ for a small perturbation $dX$. See [Section 3.3](/series/matrix_calculus/1_gradient) of the series `Matrix calculus and autodiff` for its derivation.
2. $\log(1+x) \approx x$ for small $x$.

We will also denote the Jacobian $\partial f / \partial z(t)$ as $J_f(t)$.

---

## 1. The Proof

Assume that at a given time $t$ and given a tiny step in time $\delta t$, a variable $x(t)$ is transformed to $y(t) = x(t + \delta t)$ by $f$. Then one can write:

$$y(t) = x(t) + f(x(t), t) \delta t$$

The Jacobian of $y(t)$ is:

$$\frac{\partial y(t)}{\partial x(t)} = I_n + J_f(t) \delta t$$

We use this Jacobian to write down the probability density of $y(t)$:

$$\begin{align} \log(p(y)) &= \log(p(x)) - \log(\lvert \det(\frac{\partial y}{\partial x}) \rvert) \\ \log(p(y)) - \log(p(x)) &= - \log(\lvert \det(I_n + \underbrace{J_f(t) \delta t}_{\textcolor{#b45309}{\text{small perturbation}}}) \rvert) \\ \log(p(\textcolor{#b45309}{x(t + \delta t)})) - \log(p(x)) &= - \log(\lvert 1 + \underbrace{\text{tr}(J_f(t) \delta t)}_{\textcolor{#b45309}{\text{also a small perturbation}}} \rvert) \\ &= - \log(1 + \text{tr}(J_f(t) \delta t)) \\ &= - \underbrace{\text{tr}}_{\textcolor{#b45309}{\text{linear function}}} (J_f(t) \delta t) \\ &= - \delta t \cdot \text{tr}(J_f(t)) \end{align}$$

Dividing both sides by $\delta t$ and taking the limit gives us the above expression:

$$\frac{d}{dt} \log(p(x)) = - \text{tr}(J_f(t))$$

This is what we wanted to prove (I initially thought the partial derivative made sense but now a more informed belief I have is that it should be a total derivative). One final comment: in practice it is quite expensive to calculate the Jacobian but it is easier to calculate the Jacobian-vector or vector-Jacobian products. This fact is exploited in the implementation of the algorithm. The trace is approximated by estimating $v^T J_f(t) v$ for some stochastic vector $v$ sampled from a distribution with zero mean and unit variance (Gaussian or Rademacher).

---

## 2. An interpretation of the expression

$$\text{tr}(J_f) = \nabla \cdot f$$

Trace of a Jacobian = divergence (for a function f)

Given a vector field $f(x)$, the trace of Jacobian of $f$ is nothing but the divergence of the field. Thus the above expression says that the rate of change of log-prob at a given point is negative the divergence at that point.

One key thing to note is that the function $f$ gives a velocity vector $\in R^n$ for every point $x \in R^n$ in the space. Thus it is a vector field itself. Now we can lay out our interpretation in a clear manner:

- If the divergence is positive, i.e. $\nabla \cdot f \gt 0$ at a given point, it means the probability mass is spreading out, causing the density to decrease at that point.
- If the divergence is negative, i.e. $\nabla \cdot f \lt 0$ at a given point, it means the probability mass is converging, causing the density to increase at that point.
- If the divergence is zero, i.e. $\nabla \cdot f = 0$ at a given point, it means the probability mass is neither spreading out nor converging, causing the density to remain constant at that point.

### 2.1 Continuity equation in disguise

The continuous version of normalizing flows is actually the continuity equation in disguise. To be more specific, the continuity equation is:

$$\frac{\partial \rho}{\partial t} + \nabla \cdot (\rho \mathbf{v}) = 0$$

This equation is an Eulerian description of the continuity equation. In other words, it provides the relationship between the change in density and the velocity with respect to a fixed point in space. The Lagrangian view of the continuity equation is:

$$\frac{D\rho}{Dt} + \rho\,(\nabla\cdot \mathbf{v}) = 0 \Rightarrow \textcolor{#b45309}{\boxed{\frac{D \log(\rho)}{Dt} = - \nabla\cdot \mathbf{v}}}$$

This is the same as the expression we derived for normalizing flows. Thus essentially the function $f$ is a velocity field. The goal of the CNF problem formulation is to learn the velocity field that converts the density of a well defined distribution (standard normal distribution or uniform distribution) to the density of the data distribution.

---

## Related articles:

- [Nice Jacobians for normalizing flows](/blog/jacobians_for_nf)
