---
title: VJP and JVP
---

# VJP and JVP

We continue with the previous problem and calculate the gradient of $z$ with respect to $x$ for the DAG below:

$$\underbrace{x}_{\textcolor{#e11d48}{(n,n)}} \xrightarrow{J_1} \underbrace{y}_{\textcolor{#e11d48}{\ (=x^{-1})}} \xrightarrow{J_2} \underbrace{z}_{\textcolor{#e11d48}{\ (=\|y\|_F)}}$$

But this time we do it in a way that is more efficient than calculating the Jacobians explicitly. We find the analytical solution of the gradient first and then formulate a method to calculate the gradient using the vector-Jacobian product.

---

## 0. The analytical solution

How will you calculate the gradient of $z$ with respect to $x$ using pen and paper without resorting to using large Jacobian matrices? One way is to write out the expression for the small change in $z$ given a small change in $x$, and then manipulate the expression to obtain the gradient. We know that $dy = -x^{-1}(dx)x^{-1}$. Then we have:

$$\begin{aligned} dz &= \langle \frac{y}{z}, dy \rangle \\ &= \frac{1}{z}\text{tr}(y^Tdy) \\ &= \frac{1}{z}\text{tr}(y^T\underbrace{dy}_{\textcolor{#e11d48}{-x^{-1}(dx)x^{-1}}}) \\ &= \frac{-1}{z}\text{tr}(y^T\textcolor{#e11d48}{x^{-1}(dx)x^{-1}}) \\ &= \frac{-1}{z}\text{tr}(\textcolor{#b45309}{x^{-1}y^Tx^{-1}}(dx)) \\ &= \frac{-1}{z}\langle \textcolor{#b45309}{x^{-T}yx^{-T}}, dx \rangle \end{aligned}$$

Thus the gradient is $\partial z / \partial x = \textcolor{#b45309}{\frac{-1}{z}x^{-T}yx^{-T}}$. This is indeed what an autograd system would calculate.

#### Verification using Python
```python
import torch

x = torch.randn(100,100, dtype=torch.float64, requires_grad=True)
y = torch.linalg.inv(x)
z = torch.linalg.norm(y)
z.backward()

# analytical solution
grad_pred = -(y.t() @ y @ y.t()).div(z)

# passes the check
assert torch.allclose(x.grad, grad_pred)
```

**Note how we were able to calculate the exact gradient without explicitly calculating the Jacobian matrices**. The insight here is that it is easier to calculate Jacobian-vector (or vector-Jacobian) products than Jacobian matrices. However our analytical solution is not generalizable to any function. Next we devise a strategy that is more generalizable.

---

## 1. Vector-Jacobian product

Consider a function $f(X) = Y$ followed by an _unknown_ function $g(Y): R^{n \times n} \rightarrow R$. Thus the Jacobian $J_2 \in R^{n \times n}$ is unknown. To calculate the gradient with respect to $x$, we need to calculate the vector-Jacobian product $\textcolor{#b45309}{J_2^T}\textcolor{#b45309}{J_1}$, which can be seen as a function of $J_2$. An example for $f(X) = X^{-1}$ is given below. Here is one way to figure out what this function is:

$$\begin{aligned} dz &= \langle J_2, \textcolor{#e11d48}{dY} \rangle \\ &= \langle J_2, \textcolor{#e11d48}{-X^{-1}(dX)X^{-1}} \rangle \\ &= -\text{tr}(J_2^T\textcolor{#e11d48}{X^{-1}(dX)X^{-1}}) \\ &= -\text{tr}(\textcolor{#e11d48}{X^{-1}}J_2^T\textcolor{#e11d48}{X^{-1}}(dX)) \\ &= \langle \underbrace{\textcolor{#e11d48}{-X^{-T}}J_2\textcolor{#e11d48}{X^{-T}}}_{\text{vjp}_f}, dX \rangle \end{aligned}$$

Since how a function is evaluated and also how the VJP is evaluated are both tied to a function and evaluated at a specific point, it is logical to assume that they are implemented together. One naive (and poorly planned) implementation is shown below:

#### Python implementation
```python
import torch

class Inverse:
    def __init__(self):
        self.input = None
        self.output = None
        self.grad = None

    def forward(self, x):
        self.input = x
        self.output = torch.linalg.inv(x)
        return self.output

    # the vjp is defined here
    def backward(self, g):
        self.grad = -(self.output.t() @ g @ self.output.t())
        return

    def __call__(self, x):
        return self.forward(x)


# calculate the gradient using the class defined above
x = torch.randn(100,100,dtype=torch.float64)
inverse = Inverse()
y = inverse(x)
g = y / torch.linalg.norm(y)
inverse.backward(g)

# calculate the gradient using in-built autograd
x.requires_grad_(True)
y = torch.linalg.inv(x)
z = torch.linalg.norm(y)
z.backward()

# make sure the check passes
assert torch.allclose(x.grad, inverse.grad)
```

---

### 1.1 A rigorous definition of the vjp

Given a function $f: R^n \rightarrow R^m$, the _vector-Jacobian product_ of $f$ is defined as:

$$\textcolor{#b45309}{\text{vjp}}(\ \underbrace{v}_{\textcolor{#e11d48}{\in R^m}}, \underbrace{f}_{\textcolor{#e11d48}{R^n \rightarrow R^m}}, \underbrace{x}_{\textcolor{#e11d48}{\in R^n}} \ ) = \underbrace{v^T\underbrace{J_f(x)}_{\textcolor{#e11d48}{\in R^{m \times n}}}}_{\textcolor{#e11d48}{\in R^n}}$$

In autodiff, $v$ is the gradient of a function $g: R^m \rightarrow R$ and the product gives the gradient of the scalar output with respect to the input of $f$. Here $J_f(x)$ is the Jacobian of $f$ evaluated at $x$.

There are often cases when the vjp requires some more information than just the input and output of the function. Eg $f(W) = Wx$ has the vjp defined as $\text{vjp}(v,f,w) = vx^T$. So we need to store $x$ in order to calculate the vjp. We term all the information required for vjp as _context_.

PyTorch allows implementing your own vjp by [extending autograd](https://pytorch.org/docs/stable/notes/extending.html#extending-autograd) and defining the `backward` method. The `ctx` stores all the information required for calculating vjp.

Since vjp calculates the gradients from the output to the input, for each function in the DAG the _context_ needs to be stored. This leads to a higher memory overhead when using vjp in autodiff.

---

## 2. Jacobian-vector product and directional derivative

Let's revisit an interpretation of the Jacobian we saw earlier:

$$\underbrace{\text{change in output}}_{\textcolor{#e11d48}{R^{\text{out}}}} = \underbrace{\text{Jacobian}}_{\textcolor{#b45309}{R^{\text{out}}, R^{\text{in}}}} \times \underbrace{\text{change in input}}_{\textcolor{#e11d48}{R^{\text{in}}}}$$

The RHS of the above equation is the Jacobian-vector product. It is usually written in a more compact form. Eg:

$$Y = X^{-1} \Rightarrow dY = \underbrace{\textcolor{#b45309}{-X^{-1}dXX^{-1}}}_{\textcolor{#b45309}{\text{jvp}(dX)}}$$

In fact we have been looking at Jacobian-vector products since the beginning of this series. Now it's time to look at it more formally.

---

### 2.1 Jacobian-vector product with more rigor

Using the previous example, we have $dY = \underbrace{\textcolor{#b45309}{-X^{-1}dXX^{-1}}}_{\textcolor{#b45309}{\text{jvp}(dX)}}$, we can think of the jvp as a function of $dX$. The output of this function is actually a function of $X$. It is actually a function $R^{\text{input dim}} \rightarrow R^{\text{output dim}}$ or $R^n \rightarrow R^m$ where $n$ is the input dim and $m$ is the output dim.

Now we denote the function $Y = f(X)$ as $X \longrightarrow Y$. Using this notation we have:

$$\underbrace{dX}_{\textcolor{#e11d48}{R^n}} \longrightarrow (\underbrace{X}_{\textcolor{#e11d48}{R^n}} \longrightarrow \underbrace{dY}_{\textcolor{#e11d48}{R^m}})$$

[JAX documentation](https://jax.readthedocs.io/en/latest/notebooks/autodiff_cookbook.html#jvps-in-math) has a clear and succinct description of JVPs which is worth a read.

---

### 2.2 Directional derivative

Note that propagating forward a small change in input along a DAG whose final output is a scalar gives us the change in its value. Thus we can write another method similar to `forward` which returns the output and also the JVP of a small perturbation of the input. We use the following example: $f(X) = X^{-1}, g(Y) = \|Y\|_F$ and calculate the directional derivative of $g(f(X))$ with respect to $X$.

#### Python implementation
```python
import torch

class Inverse:
    def __init__(self):
        self.input = None
        self.output = None
        self.grad = None

    def forward(self, x):
        ...

    def forward_jvp(self, x, v):
        self.input = x
        self.output = torch.linalg.inv(x)
        # jvp evaluated at x and v
        self.d_output = -self.output @ v @ self.output
        return self.output, self.d_output

    def backward(self, g):
        ...


class Norm:
    def __init__(self):
        self.input = None
        self.output = None
        self.grad = None

    def forward(self, x):
        ...

    def forward_jvp(self, x, v):
        self.input = x
        self.output = torch.linalg.norm(x)
        # jvp evaluated at x and v
        self.d_output = (self.input * v).div(self.output).sum()
        return self.output, self.d_output

    def backward(self, g):
        ...
```

To calculate the directional derivative, we can pass a unit vector to the `forward_jvp` method for the `v` argument. This is how we can get the directional derivative:

#### Python implementation
```python
x = torch.randn(100, 100, dtype=torch.float64)
dx = torch.randn_like(x).mul(1e-8)

inverse = Inverse()
norm = Norm()
dx_norm = torch.linalg.norm(dx)
# pass a unit vector to the JVP function
dx_unit = dx / dx_norm
y, dy = inverse.forward_jvp(x, dx_unit)
z_pred, directional_derivative = norm.forward_jvp(y, dy)
```

Indeed one can verify the correctness of the result by comparing it with the actual change in output:

#### Verification using Python
```python
z = torch.linalg.norm(torch.linalg.inv(x))
dz = torch.linalg.norm(torch.linalg.inv(x + dx)) - z

# passes the checks
assert torch.allclose(z, z_pred)
assert torch.allclose(dz, directional_derivative * dx_norm)
```

---

## 3. Strategies for forward mode autodiff

Forward mode autodiff will not be covered in detail but this section provides a very brief introduction. The most common way to implement forward mode autodiff is by using dual numbers. A dual number is a pair of a real number and its first order derivative with a set of rules that dictate how dual numbers are added, multiplied etc. More rigorously, dual numbers define an algebra over a pair of variables.

Another way to implement forward mode autodiff is by calculating the JVPs for standard basis vectors and propagating them forward. This needs to be done for each of the $n$ basis vectors. This is essentially the same as calculating the columns of the Jacobian matrix one at a time. We will look into it in greater detail in the next part.

---

[← Autodiff on a DAG](/series/matrix_calculus/5_autodiff_on_dag)  ·  [Hessian of a function →](/series/matrix_calculus/7_hessian)
