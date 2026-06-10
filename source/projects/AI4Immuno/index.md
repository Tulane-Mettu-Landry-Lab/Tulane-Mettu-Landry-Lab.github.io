---
title: "Explainable Adaptive Immune System Modeling"
layout: project
date: 2026-01-01
project:
  title: "Explainable Adaptive Immune System Modeling"
  category: "ImmunoInformatics"
  abbr: "XAI4Immuno"
  desc: "Using Explainable Machine Learning to Unreavel Adaptive Immune System Mechanism."
  figure: "images/tcrpmhcstruct.png"
lab:
  name: "Mettu Landry Lab"
  icon: "images/jellyroll.png"
document:
  path: "./README.md"
  centered: false
  footer: "2026 &copy; Mettu Landry Lab<br>CC BY 4.0"
nav:
  Home: "/"
  Projects: "/projects/"
  XAI4Immuno: null
papers:
  - year: 2026
    month: "April"
    title: "Quantifying Cross-Attention Interaction in Transformers for Interpreting TCR-pMHC Binding"
    publication: "ICLR"
    authors: "J.Li, et al."
    link: "/papers/ICLR2026QCAI/"
  - year: 2026
    month: "April"
    title: "TCR-EML: Explainable Model Layers for TCR-pMHC Prediction"
    publication: "LMRL@ICLR"
    authors: "J.Li, et al."
    link: "/papers/LMRL2026TCREML/"
  - year: 2025
    month: "December"
    title: "Rational Multi-Modal Transformers for TCR-pMHC Prediction"
    publication: "ACM-BCB"
    authors: "J.Li, et al."
    link: "/papers/BCB2025EGM/"
---

## Introduction
T cell receptor (TCR) recognition of peptide-MHC (pMHC) complexes is central to immunity and T cell-based therapies. We introduce an explanation-driven framework that uses a new post-hoc analysis method to guide the design of a novel encoder-decoder transformer for TCR-pMHC prediction. By revealing the most informative TCR-epitope features, our method optimizes cross-attention design, auxiliary objectives, and an explanation-based early-stopping strategy. The resulting model achieves state-of-the-art accuracy with improved robustness and interpretability, offering new insight into sequence-level binding mechanisms.

## Acknowledgement
We appreciate cooperators, researchers, and labs below:
- Dr. Zhengming Ding, Zixiang Yin
- Dr. Loren Gragert Group
- Dr. Jihun Hamm, Janet Wang, Yunbei Zhang

This project is supported by:
- Harold L. and Heather E. Jurist Center of Excellence for Artificial Intelligence at Tulane University
- National Institutes of Health (U54-CA260581) through the Tulane University COVID Antibody and Immunity Network (TUCAIN)
- Tulane SOM Pilot Funding for "MHCII Pathway Processing of SARS-CoV-2 Spike"
- Tulane Center of Excellence for Emerging and Re-emerging Infectious Diseases (CEERID) Pilot Research Program for "Large-Scale Validation of a Novel Parallel Algorithm for Computational Epitope Prediction"
- Lavin-Bernick Faculty Grant Proposal Research and Scholarly Activities Support for "Research Trainee Support for Modeling Antigen Processing and HLA Immunopeptidomics"