# Linear Algebra for Programmers

## Known mistakes in the content

These came over unchanged from the old site's posts. They are not fixed yet.

- `pages/blog/inverse_row_col_removed.md`, line 44: in the code block, the `return` line of `remove_row` has no indent, so the snippet is not valid Python.
- `pages/blog/proof_fibonacci_sequence_in_stick_lengths.md`, line 66: the formula for $l_6$ has `\varepsilon_4` twice (`2\varepsilon_4 + \varepsilon_4`). The second one is probably meant to be `\varepsilon_5`.
- `pages/blog/proof_fibonacci_sequence_in_stick_lengths.md`, line 118: "Thus the volume $V_1 = |J|V_1$" has $V_1$ on both sides. One of them is probably meant to be $V_2$.
- `pages/series/permutation_sinkhorn/1_permutation_spectra.md`, lines 10 and 18–36: the matrix $P$ has the cycles (a, b, c) and (d, e), but the figures use the permutation $[1,2,3,4,5] \to [2,4,5,1,3]$ with the cycles (1→4→2) and (3→5).
