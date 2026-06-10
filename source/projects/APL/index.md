---
title: "Antigen Processing Likelihood (APL)"
layout: project
date: 2026-01-01
project:
  title: "Antigen Processing Likelihood (APL)"
  category: "ImmunoInformatics"
  abbr: "APL"
  desc: "Illuminating Epitope Presentation with Conformation Computation."
  figure: "images/apllogo.png"
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
  APL: null
papers:
  - year: 2026
    month: "March"
    title: "APLSuite: An Integrated Suite for CD4+ T Cell Epitope Prediction via Antigen Processing Likelihood"
    publication: "Tech. Rep."
    authors: "J.Li, et al."
    link: "/blogs/APLSuite/"
  - year: 2024
    month: "December"
    title: "GPU Acceleration of Conformational Stability Computation for CD4+ T-cell Epitope Prediction"
    publication: "BIBM"
    authors: "J.Li, et al."
    link: "/papers/BIBM2024GPUCOREX/"
  - year: 2024
    month: "October"
    title: "GPU Acceleration for Markov Chain Monte Carlo Sampling"
    publication: "AIMLSys"
    authors: "J.Li, et al."
    link: "/papers/AIMLSYS2024GPUMCMC/"
---

## Introduction
T-cell CD4+ epitopes are important targets of immunity against infectious diseases and cancer. State-of-the-art methods for MHC class II epitope prediction rely on supervised learning methods in which an implicit or explicit model of sequence specificity is constructed using a training set of peptides with experimentally tested MHC class II binding affinity.

We present a novel method for CD4+ T-cell eptitope prediction based on modeling antigen-processing constraints. Previous work indicates that dominant CD4+ T-cell epitopes tend to occur adjacent to sites of initial proteolytic cleavage. Given an antigen with known three-dimensional structure, our algorithm first aggregates four types of conformational stability data in order to construct a profile of stability that allows us to identify regions of the protein that are most accessible to proteolysis. Using this profile, we then construct a profile of epitope likelihood based on the pattern of transitions from unstable to stable regions. We validate our method using 35 datasets of experimentally measured CD4+ T cell responses of mice bearing I-Ab or HLA-DR4 alleles as well as of human subjects.
