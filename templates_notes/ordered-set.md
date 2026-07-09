# Ordered Set (pb_ds)

Built on GNU's policy-based data structures ($\texttt{\\_\\_gnu\\_pbds::tree}$). Extends $\texttt{std::set}$ with **order statistics**: find the $k$-th element or count elements less than a value in $O(\log n)$.

Each node stores subtree size. $\texttt{find\\_by\\_order(k)}$ descends choosing left/right by subtree sizes. $\texttt{order\\_of\\_key(val)}$ counts nodes with keys $< $ \