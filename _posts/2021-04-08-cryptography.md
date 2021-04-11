---
layout: post
title: Cryptography
categories:
- linux
comments: true
maths: 1
---
**Currently**
- [Cryptography I - Dan Boneh, Stanford](https://www.coursera.org/learn/crypto)

**Next reading**
- [A Graduate Course in Applied Cryptography](https://toc.cryptobook.us/)
- [Cryptography - Jonathan Katz, University of Maryland](https://www.coursera.org/learn/cryptography)
- [Cryptography news and discussions - Reddit](https://www.reddit.com/r/crypto/wiki/index)

- adversary: [n] an enemy or opponent
- eavesdrop: [v] to listen secretly to what other people are saying
- tamper: [n] to change or touch sth in a way that causes damage or harm
- auction: [n] đấu giá 
- Single use key (one time key)
- Multi use key (many time key)
- privately outsourcing computation: tính toán với dữ liệu đã mã hóa??
- Zero knowledge: Alice có thể chứng mình cho Bob rằng mình biết `N = p * q` (p, q là số nguyên tố). Nhưng Bob không hề biết `q hay p` là gì cả.
- Symmetric Ciphers: Encrypt và Decripy dùng chung key `K`

$U = \{0,1\}^n$: ví dụ: $\{0,1\}^2$ = $\{00, 01, 10, 11\}$
$\vert U \vert$: size của tập hợp, số phần tử 
- uniform distribution: $P(x) = 1/\vert U \vert$
- point distribution at $P(x_0) = 1, \forall x\neq x_0: P(x) = 0$
- $A_1 \subset U, A_2 \subset U: P[A_1 \cup A_2] \leq P[A_1] + P[A_2]$
- random variables $X:U \to V$ e.g. $X:\{0,1\}^n \to \{0,1\}; X(y) = lsb(y) \space \in \{0,1\}$