async function loadCSS(url) {
    return new Promise((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.onload = resolve;
        document.head.appendChild(link);
    });
}

async function loadScript(url) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

async function loadDependencies() {

    /* ---------- CSS ---------- */

    await loadCSS("https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css");
    await loadCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css");
    await loadCSS("https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css");

    await loadCSS("https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap");
    await loadCSS("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap");

    /* ---------- JS ---------- */

    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/marked");
    await loadScript("https://cdn.jsdelivr.net/npm/marked-base-url");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js");

}

function renderLayout() {

document.body.innerHTML = `

<div class="navbar-container">
<nav class="navbar custom-frosted-navbar">

<div class="navbar-brand">
<div class="navbar-item">
<h1 class="is-size-5 has-text-weight-bold" id="Nav-Publication-Name-Container">Conference</h1>
</div>

<a role="button" class="navbar-burger" href="#cite">
<i class="fa-solid fa-quote-right"></i>
</a>
</div>

<div id="navbarMenu" class="navbar-menu">

<div class="navbar-center is-flex-mobile">
<div class="navbar-item is-flex-mobile">
<div class="buttons has-addons is-centered" id="section-indicator-container"></div>
</div>
</div>

<div class="navbar-end" id="link-buttons-container"></div>

</div>
</nav>
</div>

<div class="hero is-small">
<nav class="hero-body">
<article class="media">

<span id="top-nav-icon"></span>

<div class="media-content is-hidden-mobile">
<h1 class="subtitle" id="top-nav-title">Conference</h1>
</div>

<div class="media-content is-hidden-tablet">
<h1 class="subtitle" id="top-nav-title-abbr">Conference</h1>
</div>

</article>
</nav>
</div>

<section class="hero is-bold is-halfheight mt-0">
<div class="hero-body">
<div class="container has-text-left" id="header-title">

<div class="content">

<span id="paper-title-container"></span>

<p id="author-list-container" class="is-dmserif mb-0"></p>
<p id="affiliation-explanation-container" class="is-dmserif"></p>

<p id="link-buttons-header-container"></p>

</div>

<nav class="breadcrumb is-small">
<ul id="breadcrumb-container"></ul>
</nav>

</div>
</div>
</section>

<section class="section">
<div class="container is-max-desktop">
<div class="content" id="markdown-output-container"></div>
</div>
</section>

<section class="section">
<div class="container is-max-desktop">

<h2 class="title is-4" id="cite">Cite This Work</h2>

<div class="grid has-3-cols">

<div class="cell is-col-span-2">

<div class="tabs mb-0" id="citation-tabs">
<ul></ul>
</div>

<pre id="citation-content" class="is-mono"></pre>

</div>

<div class="cell has-text-centered is-flex is-justify-content-center is-align-items-center">
<div id="share-col"></div>
</div>

</div>
</div>
</section>

<footer class="footer">
<div class="content has-text-centered">

<p id="footer-note-container"></p>

<p>
Build <a href="https://github.com/Jiarui0923/paperpage">PaperPage</a> for your paper.
</p>

<a id="theme-toggle" class="button">
<span class="icon">
<i class="fa-solid fa-circle-half-stroke"></i>
</span>
</a>

</div>
</footer>

`;
}


// New Global State for Section Tracking
let sectionData = [];
let isSectionDataReady = false;
let scrollTimeout;

// Theme state
let theme = localStorage.getItem('theme') || 'auto';

// --- Utility Functions ---

/**
 * Safely gets a URL parameter.
 */
function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

/**
 * Extracts the base path (directory) from a full URL.
 */
function getBaseUrl(url) {
    const lastSlashIndex = url.lastIndexOf('/');
    return url.substring(0, lastSlashIndex + 1);
}

// --- Theme Functions (optimized) ---

function updateThemeButton() {
    // Get the inner <i> tag
    const icon = document.getElementById('theme-toggle').querySelector('.icon i');
    // Remove all specific theme icons
    icon.classList.remove('fa-sun', 'fa-moon', 'fa-circle-half-stroke');

    if (theme === 'light') icon.classList.add('fa-sun');
    else if (theme === 'dark') icon.classList.add('fa-moon');
    else icon.classList.add('fa-circle-half-stroke'); // auto
}

function applyTheme() {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme'); // auto
    updateThemeButton();
    localStorage.setItem('theme', theme);
}



// --- Citation Functions ---

/**
 * Creates citation tabs and attaches event listeners.
 * @param {Object} citations - Object mapping tab names to citation content.
 */
function createCitationTabs(citations) {
    document.querySelector("#citation-tabs ul").innerHTML = ''; // Clear existing tabs
    let first = true;
    for (const tabName in citations) {
        const li = document.createElement("li");
        if (first) li.classList.add("is-active");
        const a = document.createElement("a");
        a.textContent = tabName;
        a.href = "#";
        // Use a closure or arrow function to capture the correct tabName
        a.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(citations, tabName);
        });
        li.appendChild(a);
        document.querySelector("#citation-tabs ul").appendChild(li);
        first = false;
    }
}

/**
 * Switches the active citation tab and updates content.
 * @param {Object} citations - Object mapping tab names to citation content.
 * @param {string} tabName - Name of the tab to switch to.
 */
function switchTab(citations, tabName) {
    // Update active class
    document.querySelectorAll("#citation-tabs li").forEach(li => li.classList.remove("is-active"));
    const activeLi = Array.from(document.querySelectorAll("#citation-tabs li"))
        .find(li => li.textContent === tabName);
    if (activeLi) activeLi.classList.add("is-active");

    // Update pre content
    document.getElementById("citation-content").textContent = citations[tabName];
}

// --- Section Navigation Functions (MODIFIED) ---
/** Simple slugifier to create reliable IDs */
function slugify(text) {
    return text.toLowerCase()
        .trim()
        // Remove all non-word characters (including spaces) and replace with a single dash
        .replace(/[\s\W-]+/g, '-') 
        // Remove leading/trailing dashes
        .replace(/^-+|-+$/g, ''); 
}

/** Extracts headings and calculates their scroll position. */
function extractSections() {
    sectionData = [];
    const mainContent = document.getElementById('markdown-output-container');
    // Offset to activate the section slightly before it hits the top edge
    const scrollOffset = 150; 
    const usedIds = new Set(); // To ensure ID uniqueness

    if (mainContent) {
        // Look for H1, H2, H3 elements in the markdown output
        mainContent.querySelectorAll('h1, h2, h3').forEach(heading => {
            const text = heading.textContent.trim();
            if (!text) return; // Skip empty headings

            let id = heading.id;

            // 1. Generate a unique ID if missing or if the existing ID is duplicated
            if (!id || usedIds.has(id)) {
                id = slugify(text);
                
                // Handle potential duplicate slugs (e.g., two sections named "Introduction")
                let uniqueId = id;
                let counter = 1;
                while (usedIds.has(uniqueId)) {
                    uniqueId = `${id}-${counter++}`;
                }
                id = uniqueId;

                // 2. Assign the generated ID to the heading element
                heading.id = id;
            }

            usedIds.add(id);
            
            // Calculate offset from top of document
            const rect = heading.getBoundingClientRect();
            const documentTop = rect.top + window.scrollY;
            
            sectionData.push({
                id: id,
                title: text,
                // OffsetTop is document scroll position where section becomes "active"
                offsetTop: documentTop - scrollOffset
            });
        });
    }
    
    // Sort by offsetTop
    sectionData.sort((a, b) => a.offsetTop - b.offsetTop);

    isSectionDataReady = sectionData.length > 0;
    // Immediate update for initial state
    updateSectionIndicator(); 
}



/** Updates the three section links in the navbar based on scroll position. */
function updateSectionIndicator() {
    const indicatorContainer = document.getElementById('section-indicator-container');
    if (!isSectionDataReady || !indicatorContainer) return;

    // Debounce the function for performance during scrolling
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        
        const currentScroll = window.scrollY;
        let activeIndex = 0;

        // Find the current active section (the last one whose offsetTop is <= currentScroll)
        for (let i = sectionData.length - 1; i >= 0; i--) {
            // Check if current scroll position is past the section's activation point
            if (currentScroll >= sectionData[i].offsetTop) {
                activeIndex = i;
                break;
            }
        }

        const currentSection = sectionData[activeIndex];
        const prevSection = sectionData[activeIndex - 1];
        const nextSection = sectionData[activeIndex + 1];

        let html = '';

        // Previous link
        if (prevSection) {
            html += `<a class="button is-ghost section-nav-link is-prev" href="#${prevSection.id}"><i class="fa-solid fa-arrow-left"></i></a>`;
        }

        // Current link (always present if sectionData is not empty)
        html += `<a class="button is-ghost section-nav-link is-active" href="#${currentSection.id}">${currentSection.title.toUpperCase()}</a>`;

        // Next link
        if (nextSection) {
            html += `<a class="button is-ghost section-nav-link is-next" href="#${nextSection.id}"><i class="fa-solid fa-arrow-right"></i></a>`;
        }

        // Only update the DOM if the active section has changed
        if (indicatorContainer.dataset.activeId !== currentSection.id) {
            indicatorContainer.innerHTML = html;
            indicatorContainer.dataset.activeId = currentSection.id;
            enableSmoothScroll(); // Re-enable smooth scroll for the newly created links
        }
    }, 50); // Small debounce time
}

// --- Rendering Functions ---

function renderHeader(paperData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Header container with ID "${containerId}" not found.`);
        return;
    }

    // Use innerHTML for the main header block
    container.innerHTML = `
        <h4 class="subtitle" style="font-weight: 400; color: #555;">
            ${paperData.date.year} ${paperData.date.month}
        </h4>
        <h1 class="title mt-0">${paperData.title}</h1>
    `;
    // Update other elements directly
    document.getElementById("Nav-Publication-Name-Container").textContent = `${paperData.abbr} ${paperData.date.year}`;
    document.getElementById("top-nav-title").innerHTML = `${paperData.publication}`;
    document.getElementById("top-nav-title-abbr").innerHTML = `${paperData.abbr}`;
    
    if (paperData.pubicon) {
        document.getElementById("top-nav-icon").innerHTML = `
        <figure class="media-left">
            <div class="logo-container" style="height:21pt;">
                <img src="${paperData.pubicon}" style="max-width: auto;height: 100%;display: block;">
            </div>
        </figure>
        `
    }
    
    document.title = `[${paperData.abbr}] ${paperData.title}`;
}

function renderLinkButtons(links, containerId, size="is-small", ignoreExpand=false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Build all HTML once, then inject
    let buttonsHtml = '<div class="buttons has-addons is-dmserif">';

    links.forEach(link => {
        const iconHtml = `<span class="icon" style="margin-right: -5pt;"><i class="${link.icon}"></i></span>`;
        const textHtml = `<span class="text">&nbsp;&nbsp;${link.name}</span>`;

        // Simplified logic: link.expand is used to *disable* the default hover-expand
        const expand_tag = link.expand && !ignoreExpand ? '' : 'hover-expand';
        
        
        buttonsHtml += `
            <a class="button is-small is-rounded frosted-button ${expand_tag} ${size}" href="${link.link}">
                ${iconHtml}
                ${textHtml}
            </a>
        `;
    });

    // Append the fixed "Cite" button
    // const expand_tag = !ignoreExpand ? '' : 'hover-expand';
    const expand_tag = 'hover-expand';
    buttonsHtml += `
        <a class="button is-small is-rounded frosted-button ${expand_tag} is-link is-outlined ${size}" href="#cite">
            <span class="icon" style="margin-right: -5pt;"><i class="fa-solid fa-quote-right"></i></span>
            <span class="text">&nbsp;&nbsp;Cite</span>
        </a>
    `;

    buttonsHtml += '</div>';
    container.innerHTML = buttonsHtml;
}

function renderNavLinkButtons(links, containerId, size="is-small", ignoreExpand=false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Build all HTML once, then inject
    let buttonsHtml = '';

    links.forEach(link => {
        const iconHtml = `<span class="icon" style="margin-right: -5pt;"><i class="${link.icon}"></i></span>`;
        const textHtml = `<span class="text">&nbsp;&nbsp;${link.name}</span>`;

        // Simplified logic: link.expand is used to *disable* the default hover-expand
        const expand_tag = link.expand && !ignoreExpand ? '' : 'hover-expand';
        
        
        buttonsHtml += `
            <a class="navbar-item ${expand_tag} ${size} is-dmserif" href="${link.link}">
                ${iconHtml}
                ${textHtml}
            </a>
        `;
    });

    // Append the fixed "Cite" button
    // const expand_tag = !ignoreExpand ? '' : 'hover-expand';
    const expand_tag = 'hover-expand';
    buttonsHtml += `
        <a class="navbar-item button is-ghost ${expand_tag} is-link is-outlined is-dmserif" href="#cite">
            <span class="icon" style="margin-right: -5pt;"><i class="fa-solid fa-quote-right"></i></span>
            <span class="text">&nbsp;&nbsp;Cite</span>
        </a>
    `;

    container.innerHTML = buttonsHtml;
}

function renderAuthors(authors) {
    if (!document.getElementById('author-list-container') || !document.getElementById('affiliation-explanation-container')) {
        console.error('Author or explanation container not found.');
        return;
    }

    // --- Step 1: Map affiliations and track labels ---
    const affiliationMap = {};
    let affiliationCounter = 1;
    const usedLabels = { plus: false, star: false };

    authors.forEach(author => {
        // Assign a unique number to each unique affiliation string
        if (!affiliationMap[author.affiliation]) {
            affiliationMap[author.affiliation] = {
                number: affiliationCounter++,
                name: author.affiliation
            };
        }
        author.affilNumber = affiliationMap[author.affiliation].number;

        // Track usage of special symbols
        if (author.equal) usedLabels.plus = true;
        if (author.corresponding) usedLabels.star = true;
    });

    // --- Step 2: Build Author List HTML (single injection) ---
    let authorListHtml = authors.map((author, index) => {
        const separator = index < authors.length - 1 ? ' &middot;\n' : '';
        
        let authorEntry = `<strong>${author.name}</strong>`;
        if (author.link) {
            authorEntry = `<a href="${author.link}">${authorEntry}</a>`;
        }

        // Append superscripts
        let supTags = '';
        if (author.affilNumber) {
            supTags += `<span class="sup" data-number="${author.affilNumber}"></span>`;
        }
        if (author.equal) {
            supTags += `<span class="sup" data-symbol="plus"></span>`;
        }
        if (author.corresponding) {
            supTags += `<span class="sup" data-symbol="star"></span>`;
        }

        return authorEntry + supTags + separator;
    }).join('');

    document.getElementById('author-list-container').innerHTML = authorListHtml;


    // --- Step 3: Build Affiliation/Explanation HTML (single injection) ---
    let explanationHtml = '';

    // Affiliation list (sorted by number 1, 2, 3...)
    const sortedAffiliations = Object.values(affiliationMap).sort((a, b) => a.number - b.number);
    
    sortedAffiliations.forEach((affil) => {
        explanationHtml += `<span class="sup" data-number="${affil.number}"></span>${affil.name}<br>`;
    });

    // Add special label explanations only if they were used
    if (usedLabels.plus) {
        explanationHtml += `<span class="sup" data-symbol="plus"></span>Equal Contribution(s)<br>`;
    }
    if (usedLabels.star) {
        explanationHtml += `<span class="sup" data-symbol="star"></span>Corresponding Author(s)<br>`;
    }

    document.getElementById('affiliation-explanation-container').innerHTML = explanationHtml;
};

function renderBreadcrumb(breadcrumbData) {
    const nav = document.getElementById('breadcrumb-nav');
    const container = document.getElementById('breadcrumb-container');

    // Guard: null, undefined, or empty object
    if (
        !breadcrumbData ||
        typeof breadcrumbData !== 'object' ||
        Object.keys(breadcrumbData).length === 0
    ) {
        nav.style.display = 'none';
        return;
    }

    const entries = Object.entries(breadcrumbData);

    entries.forEach(([label, href], index) => {
        const li = document.createElement('li');

        // Active breadcrumb (last or null href)
        if (index === entries.length - 1 || href === null) {
        li.className = 'is-active';

        const a = document.createElement('a');
        a.textContent = label;
        a.setAttribute('aria-current', 'page');
        li.appendChild(a);
        } else {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        li.appendChild(a);
        }

        container.appendChild(li);
    });
}

function renderMarkdown(markdown, containerId, basePath = '', centered = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Check if marked and markedBaseUrl are loaded
    if (typeof marked === 'undefined' || typeof markedBaseUrl === 'undefined') {
        console.error("Markdown libraries are not loaded.");
        container.innerHTML = '## Error Rendering Content\nMarkdown renderer is not available.';
        return;
    }
    
    marked.use(markedBaseUrl.baseUrl(basePath));
    // Use marked.parse() for rendering
    const html = marked.parse(markdown);
    
    container.innerHTML = html;

    // Manage centered class without using ternary operator for clarity
    if (centered) {
        container.classList.add("has-text-centered");
    } else {
        container.classList.remove("has-text-centered"); 
    }
};

async function fetchAndRenderMarkdown(url, containerId, centered) {
    let markdownText = '';
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        markdownText = await response.text();
    } catch (error) {
        console.error(`Failed to load markdown from ${url}: `, error);
        markdownText = '## Error Loading Content\nCould not load the markdown file. Please check the network path.';
    }

    renderMarkdown(markdownText, containerId, getBaseUrl(url), centered);
};

function renderFooter(content) {
    const container = document.getElementById("footer-note-container");
    if (container && content) {
        container.innerHTML = content;
    }
};

/**
 * Attaches smooth scroll behavior to all anchor links.
 */
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Ensure we only add the listener once. The original code added listeners inside a loop 
        // in the global scope AND inside initPaperPage, leading to potential duplicates. 
        // This version centralizes it in initPaperPage.
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};

function renderSharePage() {
    const url = window.location.href;
    // Find the target div
    const cell = document.querySelector('#share-col');
    const qr = new QRCode(cell, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
};

// --- Initialization Function ---

async function initPaperPage(paperData) {
    // Check for required data
    if (!paperData || !paperData.paper || !paperData.authors || !paperData.links || !paperData.document || !paperData.citations) {
        console.error("Incomplete paperData structure received.");
        return;
    }

    renderHeader(paperData.paper, 'paper-title-container');
    renderAuthors(paperData.authors);
    renderBreadcrumb(paperData.nav);
    // Render buttons for both header and navbar
    renderNavLinkButtons(paperData.links, "link-buttons-container", "is-small", true);
    renderLinkButtons(paperData.links, "link-buttons-header-container", "");
    
    // Note: This relies on marked being loaded via 'defer' before this is called
    await fetchAndRenderMarkdown(paperData.document.path, "markdown-output-container", paperData.document.centered);

    // NEW: Extract sections only from the rendered markdown
    extractSections();
    window.addEventListener('scroll', updateSectionIndicator);
    window.addEventListener('resize', extractSections); // Re-calculate offsets on resize
    
    renderFooter(paperData.document.footer);
    createCitationTabs(paperData.citations);
    
    // Set initial citation tab
    const firstCitationKey = Object.keys(paperData.citations)[0];
    if (firstCitationKey) {
        switchTab(paperData.citations, firstCitationKey);
    }
    
    applyTheme();
    enableSmoothScroll();
    renderSharePage();
    // Cycle theme: auto → light → dark → auto
    document.getElementById('theme-toggle').addEventListener('click', () => {
        if (theme === 'auto') theme = 'light';
        else if (theme === 'light') theme = 'dark';
        else theme = 'auto';
        applyTheme();
    });
};

// --- Main Execution Block (optimized) ---
async function init() {
(async function() {
    await loadDependencies();

    renderLayout();

    let yamlDataString = '';
    
    // 1. Determine the path
    const configParam = getQueryParam('paper');
    const yamlPath = configParam || './blog.yaml';
    
    // 2. Fetch the data
    try {
        const response = await fetch(yamlPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        yamlDataString = await response.text();
    } catch (fetchError) {
        console.error("Error fetching YAML file. Template rendering stopped.", fetchError);
        return;
    }

    // 3. Parse the data (Wait for js-yaml to load if deferred)
    // A simple busy-wait loop is generally discouraged, but in a non-module scenario 
    // with defer, we rely on the library being available shortly after the main script starts.
    if (typeof jsyaml === 'undefined' || !jsyaml.load) {
        // For a more robust solution, this would use a module loader or a check-and-wait loop.
        console.error("js-yaml library is not loaded. Cannot parse YAML.");
        return;
    }

    try {
        const fullPaperData = jsyaml.load(yamlDataString);
        // 4. Initialize the page
        initPaperPage(fullPaperData);
    } catch (parseError) {
        console.error("Error parsing YAML data:", parseError);
    }


})();
}
document.addEventListener("DOMContentLoaded", init);