---
title: Paper: A Flag Decomposition for Hierarchical Datasets
---

# Paper: A Flag Decomposition for Hierarchical Datasets

This article explains the key idea in the paper [A Flag Decomposition for Hierarchical Datasets](https://arxiv.org/abs/2502.07782) by Mankovich et al. It allows one to decompose (or factorize) a matrix `A` into a product of matrices `QR` which tries to preserve the hierarchical structure of the data.

---

## 0. Problem Statement

Hierarchical data can be represented by a list of column vectors $A_i \in \mathbb{R}^{n \times n_i}$, where $A_i \subset A_{i+1}$. We can also represent the extra columns that are added by $B_{i+1} = A_{i+1} \setminus A_i$ (assuming a column as an element in the ordered set of columns) with $B_0 = A_0$. In the example below, three such matrices are shown.

<div style="display: flex; justify-content: center; margin: 1.5rem 0;">
<svg width="240" height="351" viewBox="10 -60 130 190" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(20,0)">
    <rect x="0" y="0" width="20" height="100" fill="none" stroke="#e11d48" stroke-width="2" />
    <rect x="20" y="0" width="30" height="100" fill="none" stroke="#e11d48" stroke-width="2" />
    <rect x="50" y="0" width="40" height="100" fill="none" stroke="#e11d48" stroke-width="2" />
    <g font-family="ui-sans-serif, system-ui" font-size="14">
      <text x="11" y="115" font-size="10" text-anchor="middle" fill="#b45309">B₁</text>
      <text x="36" y="115" font-size="10" text-anchor="middle" fill="#b45309">B₂</text>
      <text x="71" y="115" font-size="10" text-anchor="middle" fill="#b45309">B₃</text>
    </g>
    <g transform="translate(0, 120)">
      <path d="M 0 -5 L 0 -10 L 5 -10 M 19 -5 L 19 -10 L 14 -10" stroke="#b45309" fill="none" transform="translate(0, -10) scale(1, -1) translate(0, 10)" />
      <path d="M 21 -5 L 21 -10 L 30 -10 M 49 -5 L 49 -10 L 39 -10" stroke="#b45309" fill="none" transform="translate(0, -10) scale(1, -1) translate(0, 10)" />
      <path d="M 51 -5 L 51 -10 L 65 -10 M 89 -5 L 89 -10 L 74 -10" stroke="#b45309" fill="none" transform="translate(0, -10) scale(1, -1) translate(0, 10)" />
    </g>
    <path d="M 0 -5 L 0 -10 L 6 -10 M 20 -5 L 20 -10 L 14 -10" stroke="#0d9488" fill="none" />
    <text x="10" y="-5" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="10" fill="#0d9488">A₁</text>
    <path d="M 0 -22 L 0 -30 L 17 -30 M 50 -22 L 50 -30 L 33 -30" stroke="#0d9488" fill="none" />
    <text x="25" y="-25" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="10" fill="#0d9488">A₂</text>
    <path d="M 0 -42 L 0 -50 L 37 -50 M 90 -42 L 90 -50 L 53 -50" stroke="#0d9488" fill="none" />
    <text x="45" y="-45" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="10" fill="#0d9488">A₃</text>
  </g>
</svg>
</div>

Note that $A_3$ is the entire data matrix. We want to find an orthogonal basis for each subspace such that the hierarchical structure is preserved.

---

## 1. Key idea

We want to create a hierarchy of subspaces that respects the hierarchical structure of the data. Such a subspace can be represented by an orthogonal matrix $Q: Q^TQ = I$. Specifically, for each $B_i \in \mathbb{R}^{n \times b_i}$, we want to find a set of $m_i$ orthonormal vectors $Q_i \in \mathbb{R}^{n \times m_i},\; m_i \leq b_i$ that preserve the structure of $B_i$ (in a way that will be defined shortly) as much as possible. We also have $Q_i^T Q_j = 0$ for $i \neq j$, meaning the subspaces are orthogonal to each other.

Once we obtain these $Q_i$ matrices, here is how the data can be represented:

$$\begin{align} B_1 &\approx (Q_1Q_1^T) B_1 \\ B_2 &\approx (Q_1Q_1^T + Q_2Q_2^T)B_2 \\ B_3 &\approx (Q_1Q_1^T + Q_2Q_2^T + Q_3Q_3^T)B_3 \\ &\vdots \\ B_k &\approx (\sum_{i=1}^{k-1} Q_iQ_i^T) B_k \end{align}$$

where `k` is the number of levels in the hierarchy. Here is how one can interpret each term in the sum above:

$$\underbrace{\overbrace{Q_i Q_i^T}^{\textcolor{#b45309}{\text{projection matrix}}} B_i}_{\textcolor{#e11d48}{\text{projection onto subspace i}}}$$

### 1.1 Finding the $Q_i$ matrices

The expression $B_1 \approx Q_1Q_1^T B_1$ can be seen as finding a projection matrix that best approximates $B_1$ in the subspace spanned by $Q_1$. This is essentially solving a least-squares problem. The solution to it is given by the first $m_i$ columns of the left singular vectors of $B_1$.

$$\textcolor{#e11d48}{Q_1 = U[:, \text{:}m_1]} \ \text{where} \ \textcolor{#b45309}{B_1 = U \Sigma V^T}$$

The expression $B_2 \approx Q_1Q_1^T B_1 + Q_2Q_2^T B_2$ can be seen as finding a projection matrix that best approximates $B_2$ in the subspace spanned by $Q_2$, after removing the component already explained by $Q_1$.

$$\textcolor{#e11d48}{Q_2 = U[:, \text{:}m_2]} \ \text{where} \ \textcolor{#b45309}{B_2 - Q_1Q_1^TB_2 = U \Sigma V^T}$$

The expression $B_3 \approx Q_1Q_1^T B_1 + Q_2Q_2^T B_2 + Q_3Q_3^T B_3$ can be seen as finding a projection matrix that best approximates $B_3$ in the subspace spanned by $Q_3$, after removing the component already explained by $Q_1$ and $Q_2$.

$$\textcolor{#e11d48}{Q_3 = U[:, \text{:}m_3]} \ \text{where} \ \textcolor{#b45309}{B_3 - Q_1Q_1^TB_3 - Q_2Q_2^TB_3 = U \Sigma V^T}$$

This pattern continues for all $Q_i$ where $i = 1, 2, \ldots, k$.

---

## 2. Decomposition

Now that we have computed all the $Q_i$ matrices, we can write the data matrix $A_k (k=3)$ as:

$$A_k = \begin{bmatrix} Q_1 & Q_2 & Q_3 \end{bmatrix} \begin{bmatrix} Q_1^TB_1 & \textcolor{#b45309}{Q_1^TB_2} & \textcolor{#e11d48}{Q_1^TB_3} \\ \textcolor{#71717a}{0} & \textcolor{#b45309}{Q_2^TB_2} & \textcolor{#e11d48}{Q_2^TB_3} \\ \textcolor{#71717a}{0} & \textcolor{#71717a}{0} & \textcolor{#e11d48}{Q_3^TB_3} \end{bmatrix} = QR$$

The right matrix can be re-written as a $k \times k$ block upper triangular matrix $R$ where each entry $R_{ij} \in \mathbb{R}^{m_i \times m_j}$. Note that these arguments hold true for any $k$.

---

## 3. Algorithm

The following observation will help us implement the algorithm efficiently:

$$Q_i^T ( B_j - \sum_{c \ne i } Q_c Q_c^T B_j) = Q_i^T B_j$$

The implementation below is largely a modification of the official [implementation](https://github.com/nmank/FD/blob/fe6157af7b2c3609825bb1a47a222644d1c679d2/FD.py#L27-L77) of the algorithm:

```python
def flag_decomposition(data, Aset, flag_type):
    n, p = data.shape
    k = len(flag_type)
    ms = [flag_type[0]] + [flag_type[i]-flag_type[i-1] for i in range(1,k)]
    R = np.zeros((sum(ms), p))
    Qs = []

    B_indices = [np.array(Aset[0])]+[np.setdiff1d(Aset[i],Aset[i-1])for i in range(1,len(Aset))]
    Bs = [data[:,Bset_i] for Bset_i in B_indices]

    for i in range(k):
        for j in range(i,k):
            if j == i:
                Ui,_,_ = np.linalg.svd(Bs[i], full_matrices=False)
                Ui = Ui[:,:ms[i]]
                Qs.append(Ui)
                R_block = Ui.T @ Bs[i]
                R[sum(ms[:i]):sum(ms[:i+1]), B_indices[j]] = R_block
            else:
                Ui = Qs[i]
                R_block = Ui.T @ Bs[j]
                R[sum(ms[:i]):sum(ms[:i+1]), B_indices[j]] = R_block
                Bs[j] = Bs[j] - Ui @ R_block

    return np.concatenate(Qs, axis=1), R
```

---

## Related articles:

- [Projection matrix](/la/20_projection_matrix)
- [Singular Value Decomposition](/la/23_svd)
