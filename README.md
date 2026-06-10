# Mettu Landry Lab Website

Static site for the Mettu Landry Lab, built with [Hexo](https://hexo.io/).

Previously a client-side JS-rendered site, now migrated to Hexo for static pre-rendering. All original content, styling (Bulma-based), and interactive features (theme toggle, citation tabs, section navigation, QR codes) are preserved.

## Project Structure

```
├── _config.yml              # Hexo config (site title, URL, permalinks, etc.)
├── source/
│   ├── _data/
│   │   └── home.yml          # Homepage data (hero, about, news, projects, team)
│   ├── index.md              # Homepage (layout: home)
│   ├── assets/               # Shared assets (favicon, logos, avatars, background)
│   ├── papers/               # Paper pages (one subdirectory per paper)
│   │   ├── ICLR2026QCAI/
│   │   │   ├── index.md      # Front-matter + markdown body
│   │   │   ├── images/       # Paper-specific images
│   │   │   └── *.pdf         # Paper PDF
│   │   └── ...
│   ├── projects/             # Project pages
│   │   ├── index.md          # Project list (layout: project-list)
│   │   ├── APL/
│   │   │   ├── index.md      # Front-matter + markdown body
│   │   │   └── images/
│   │   └── AI4Immuno/
│   └── blogs/                # Blog/tech-report pages (layout: paper)
│       └── APLSuite/
├── themes/
│   └── lab-theme/            # Custom theme
│       ├── _config.yml       # Theme CDN config
│       ├── layout/
│       │   ├── layout.ejs    # Base layout (head, CDN deps, theme JS)
│       │   ├── home.ejs      # Homepage layout
│       │   ├── paper.ejs     # Paper & blog layout
│       │   ├── project.ejs   # Individual project layout
│       │   └── project-list.ejs  # Project listing layout
│       └── source/
│           └── css/
│               └── style.css # Consolidated stylesheet
├── scaffolds/                # Hexo post/page/draft scaffolds
├── public/                   # Generated static site (gitignored)
└── package.json
```

## Local Development

**Prerequisites:** Node.js >= 16

```bash
# Install dependencies
npm install

# Start development server with live reload
npx hexo server

# Or if hexo-cli is installed globally:
hexo server
```

Site will be available at `http://localhost:4000`.

## Content Management

### Adding a New Paper

1. Create a directory under `source/papers/<PAPER_SLUG>/`
2. Create `index.md` with front-matter:

```yaml
---
title: "Paper Title"
layout: paper
date: 2026-06-10
paper:
  title: "Paper Title"
  publication: "Conference Name"
  date:
    month: June
    year: 2026
  abbr: "CONF"
  pubicon: "./images/venue-logo.svg"
authors:
  - name: "Author Name"
    affiliation: "Department, University"
    link: "https://personal.site/"
  - name: "Corresponding Author"
    affiliation: "Department, University"
    link: "https://site.edu/"
    corresponding: true
links:
  - name: "Paper"
    link: "https://openreview.net/..."
    icon: "fa-regular fa-file"
    expand: true
  - name: "PDF"
    link: "paper.pdf"
    icon: "fa-solid fa-file-pdf"
citations:
  Bibtex: |
    @inproceedings{...}
  APA: "Author. (2026). Title..."
document:
  path: "./README.md"
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Projects: "/projects/"
  PAPER: null
---

Your markdown content here...
```

3. Add images to `source/papers/<PAPER_SLUG>/images/`
4. Add PDF to `source/papers/<PAPER_SLUG>/`

### Adding a New Project

1. Create `source/projects/<PROJECT_SLUG>/index.md`
2. Use `layout: project` (see existing projects for format)
3. Add images to `source/projects/<PROJECT_SLUG>/images/`

### Updating the Homepage

Edit `source/_data/home.yml` to update:
- Hero section (title, description, background image, icons)
- About section
- News items
- Featured projects
- Team members
- Contact info and footer

### Adding a Blog / Tech Report

1. Create `source/blogs/<SLUG>/index.md`
2. Use `layout: paper` (same format as papers)
3. Add images/PDFs as needed

## Building & Deployment

```bash
# Clean and build
npx hexo clean && npx hexo generate

# Output is in public/ directory
```

The `public/` directory contains the fully static site ready for deployment to GitHub Pages or any static hosting.

### GitHub Pages Deployment

The deploy config in `_config.yml` is already set to push to the `webpage` branch:

```yaml
deploy:
  type: 'git'
  repo: 'https://github.com/Tulane-Mettu-Landry-Lab/Tulane-Mettu-Landry-Lab.github.io.git'
  branch: 'webpage'
```

To deploy, run:

```bash
npx hexo clean && npx hexo deploy --generate
```

This will:
1. Clean old output
2. Regenerate the static site in `public/`
3. Push `public/` to the `webpage` branch via `hexo-deployer-git`

Make sure your git credentials are set up for the repository before deploying.
