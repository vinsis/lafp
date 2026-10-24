---
title: SINQ — Sinkhorn-like iterations for quantization
---

# SINQ — Sinkhorn-like iterations for quantization

Sinkhorn iteration involves normalization of rows of a matrix followed by normalization of columns of the same matrix. This process is repeated until the matrix converges to a matrix with all rows and columns normalized.

$$\begin{bmatrix} \textcolor{#b45309}{a_{11}} & \textcolor{#b45309}{a_{12}} & \textcolor{#b45309}{a_{13}} & \textcolor{#b45309}{a_{14}} & \textcolor{#b45309}{a_{15}} \\ a_{21} & a_{22} & a_{23} & a_{24} & a_{25} \\ a_{31} & a_{32} & a_{33} & a_{34} & a_{35} \\ a_{41} & a_{42} & a_{43} & a_{44} & a_{45} \\ a_{51} & a_{52} & a_{53} & a_{54} & a_{55} \end{bmatrix}$$

<p style="text-align: center; color: #71717a; font-size: 0.85rem; margin-top: -0.5rem;">A Sinkhorn step normalizes one row (highlighted) or one column at a time; the iteration alternates between all rows and all columns until the matrix converges.</p>

For Sinkhorn iteration, normalization is defined as `normalize(x) = x / x.sum()`. The theory behind it is well-founded and the iteration is [guaranteed to converge](/series/permutation_sinkhorn/6_matrix_scaling) as long as the matrix is indecomposable.

One could generalize the `normalize` function to be any function of the form $R^n \rightarrow R^n$ and iteratively normalize rows and columns (although theoretically it is not clear if it will converge). Recently there was a paper [SINQ: Sinkhorn-Normalized Quantization for Calibration-Free Low-Precision LLM Weights](https://arxiv.org/abs/2509.22944) that does something similar.

---

## Key idea in SINQ

The authors use the following definition of normalization in their paper: $\text{normalize}(x) = x * \frac{\text{min\_std}}{x.std()}$ where $\text{min\_std}$ is the minimum standard deviation of all rows and columns. A rough implementation is shown below:

```python
def imbalance(mat):
    s1, s2 = torch.std(mat, 1), torch.std(mat, 0)
    s_min = torch.minimum(s1.min(), s2.min()).clamp_min(1e-12)
    s_max = torch.maximum(s1.max(), s2.max())
    return s_max / s_min          # scalar

def sinkhorn_std(matrix):
    balanced_matrix = matrix.clone()

    sigma_min = min(balanced_matrix.std(dim=1).clamp(1e-3, 1e3).min(), balanced_matrix.std(dim=0).clamp(1e-3, 1e3).min())
    min_imbalance = imbalance(balanced_matrix)

    mu_row = torch.ones(matrix.shape[0])
    mu_col = torch.ones(matrix.shape[1])

    mu_row_star = mu_row.clone()
    mu_col_star = mu_col.clone()

    clamp_min, clamp_max = torch.tensor(-.3).exp(), torch.tensor(10.).exp()

    for i in range(8):
        current = matrix / mu_col.view(1,-1) / mu_row.view(-1,1)
        scaled_row_std = (current.std(dim=1).clamp(1e-3, 1e3) / sigma_min).clamp(0.7,2)
        scaled_col_std = (current.std(dim=0).clamp(1e-3, 1e3) / sigma_min).clamp(0.7,2)
        mu_row = (mu_row * scaled_row_std).clamp(clamp_min, clamp_max)
        mu_col = (mu_col * scaled_col_std).clamp(clamp_min, clamp_max)
        balanced_matrix = matrix / mu_col.view(1,-1) / mu_row.view(-1,1)
        if imbalance(balanced_matrix) > min_imbalance:
            balanced_matrix = matrix / mu_col_star.view(1,-1) / mu_row_star.view(-1,1)
            break
        else:
            min_imbalance = imbalance(balanced_matrix)
            mu_row_star = mu_row.clone()
            mu_col_star = mu_col.clone()

    return balanced_matrix
```

The actual implementation does the same thing but in log scale for better stability. The original implementation [can be seen here](https://github.com/huawei-csl/SINQ/blob/f30bd1c084a878f80d49eecbcd1820683a3de6cf/sinq/sinkhorn.py#L7).

---

## Thoughts

When I saw the title I assumed the authors found a link between quantization and Sinkhorn distance, or were using the conventional matrix scaling to find a better value to quantize. However it seems the term *Sinkhorn* has become synonymous with iteratively row and column scaling. The current implementation seems a bit hacky but it is impressive that they were able to make it work. It also indicates the existence of a class of normalization functions that can be used for matrix scaling.

I have not had the time to think about the behavior of the normalization used in this paper. But it surely provided me some new ideas about novel ways to scale matrices (eg could this vector to vector function be *learnt*?).

---

## Related articles:

- [Matrix scaling](/series/permutation_sinkhorn/6_matrix_scaling)
- [New solution to GPTQ quantization algorithm](/blog/new_proof_gptq)
