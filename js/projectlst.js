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
<div class="navbar-container is-hidden">
    <nav class="navbar custom-frosted-navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <div class="navbar-item">
                <h1 class="is-size-5 has-text-weight-bold" id="Nav-Publication-Name-Container">Conference</h1>
            </div>
        </div>
        <div id="navbarMenu" class="navbar-menu">
            <!-- Center Section Indicator (NEW) -->
            <div class="navbar-end is-flex-mobile">
                <div class="navbar-item is-flex-mobile">
                    <div class="buttons has-addons is-centered" id="section-indicator-container">

                    </div>
                </div>
            </div>
        </div>
    </nav>
</div>

<div class="hero is-small">
    <nav class="hero-body">
        <article class="media">
            <span id="top-nav-icon">
                
            </span>
            
            <div class="media-content is-hidden-mobile">
                <h1 class="subtitle" id="top-nav-title">lab name</h1>
            </div>
            <div class="media-content is-hidden-tablet">
                <h1 class="subtitle" id="top-nav-title-abbr">lab name</h1>
            </div>
            
            </article>
    </nav>
</div>

<section class="hero is-bold is-halfheight mt-0">
    <div class="hero-body hero-body-relative">

        <!-- TEXT -->
        <div class="container hero-inner">
            
            <div class="content">
                <h4 class="subtitle" style="font-weight: 400; color: #555;" id="page-info-subtitle">
                    Loading
                </h4>
                <h1 class="title mt-0" id="page-info-title">
                    Loading
                </h1>
                <p class="is-dmserif mb-0" id="page-info-desc">
                    Loading
                </p>
            </div>
            <nav class="breadcrumb is-small" aria-label="breadcrumbs">
                <ul id="breadcrumb-container"></ul>
            </nav>
        </div>
        
    </div>
</section>

<span id="project-info-container">
</span>

<footer class="footer">
    <div class="content has-text-centered">
        <p id="footer-note-container"></p>
        <p>
            Build <a href="https://github.com/Jiarui0923/paperpage">ProjectPage</a> for your project.
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


// --- Rendering Functions ---



function renderHeader(projectData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Header container with ID "${containerId}" not found.`);
        return;
    }
    html_content = `
    <section class="hero is-bold is-halfheight mt-0">
    <div class="hero-body hero-body-relative">
    `
    if (projectData.figure) {
        html_content += `
        <div class="hero-image-left is-hidden-mobile fade-vertical">
        <img src="${projectData.figure}" alt="Hero image">
        </div>
        `
    }
    // Use innerHTML for the main header block
    html_content += `
        <!-- TEXT -->
        <div class="container hero-inner">
            <div class="content">
                <h4 class="subtitle" style="font-weight: 400; color: #555;">
                    ${projectData.category}
                </h4>
                <h1 class="title mt-0 mb-2">${projectData.title}</h1>
                <p class="is-dmserif mt-0">${projectData.desc}</p>

                <a class="button is-ghost" href="${projectData.link}">
                    <span>Check more details about ${projectData.abbr}</span>
                    <span class="icon is-small">
                        <i class="fas fa-solid fa-right-long"></i>
                    </span>
                </a>
            </div>
        </div>
    `;
    html_content += `
    </div>
    </section>
    `
    container.innerHTML += html_content;
    
}

function renderLabHeader(labData) {
    document.getElementById("Nav-Publication-Name-Container").textContent = `Projects`;
    document.getElementById("top-nav-title").innerHTML = `${labData.name}`;
    document.getElementById("top-nav-title-abbr").innerHTML = `${labData.name}`;
    if (labData.icon) {
        document.getElementById("top-nav-icon").innerHTML = `
        <figure class="media-left">
            <div class="logo-container" style="height:21pt;">
                <img src="${labData.icon}" style="max-width: auto;height: 100%;display: block;">
            </div>
        </figure>
        `
    }
    document.title = `[Projects] ${labData.name}`;
}

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


function renderFooter(content) {
    const container = document.getElementById("footer-note-container");
    if (container && content) {
        container.innerHTML = content;
    }
};

function renderPageInfo(content) {
    document.getElementById("page-info-subtitle").innerHTML = content.subtitle;
    document.getElementById("page-info-title").innerHTML = content.title;
    document.getElementById("page-info-desc").innerHTML = content.desc;
}

// --- Initialization Function ---

async function initPaperPage(projectData) {
    // Check for required data
    if (!projectData || !projectData.projects || !projectData.lab || !projectData.document) {
        console.error("Incomplete paperData structure received.");
        return;
    }
    renderPageInfo(projectData.page);
    renderLabHeader(projectData.lab);
    projectData.projects.forEach((proj) => {
        renderHeader(proj, 'project-info-container');
    });
    renderBreadcrumb(projectData.nav);
    renderFooter(projectData.document.footer);
    
    // Set initial citation tab
    // const firstCitationKey = Object.keys(projectData.citations)[0];
    // if (firstCitationKey) {
    //     switchTab(projectData.citations, firstCitationKey);
    // }
    
    applyTheme();
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
    const script = document.querySelector('script[src*="projectlst.js"]');
    const configPath = script?.dataset?.config;
    const yamlPath = configPath ?? './projectlst.yaml';
    
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