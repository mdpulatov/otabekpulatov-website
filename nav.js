/**
 * nav.js — single-source navigation for otabekpulatov.com
 *
 * Usage: add ONE line as the first element inside <body> on any page:
 *   <script src="nav.js"></script>
 *
 * To update navigation site-wide, edit ONLY this file.
 */
(function () {
  'use strict';

  // ── Detect home page ────────────────────────────────────────────────────────
  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('/index.html');

  // Smart anchor helper: on home, use #anchor; elsewhere, use index.html#anchor
  const a = (anchor) => isHome ? anchor : 'index.html' + anchor;

  // ── Inject CSS (scoped to #site-nav to avoid conflicts) ────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #site-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 clamp(1.5rem,4vw,4rem); height: 72px;
      background: rgba(250,249,245,.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(230,224,208,.6);
      transition: background .4s, box-shadow .4s;
      font-family: 'DM Sans', -apple-system, sans-serif;
    }
    #site-nav.scrolled {
      background: rgba(250,249,245,.97);
      box-shadow: 0 1px 3px rgba(15,29,47,.06);
    }
    #site-nav .nav-logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.25rem; font-weight: 600;
      color: var(--navy, #0f1d2f); text-decoration: none; white-space: nowrap;
    }
    #site-nav .nav-logo span { color: var(--gold, #c8944a); font-weight: 400; }

    #site-nav .nav-links {
      display: flex; gap: .35rem; list-style: none; align-items: center;
    }
    #site-nav .nav-links > li > a {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: .82rem; font-weight: 600;
      color: var(--text-secondary, #5c5648); text-decoration: none;
      padding: 8px 14px; border-radius: 8px;
      transition: all .25s; border: 1.5px solid transparent;
      text-transform: uppercase; letter-spacing: .08em;
    }
    #site-nav .nav-links > li > a:hover {
      color: var(--navy, #0f1d2f);
      background: rgba(200,148,74,.1); border-color: rgba(200,148,74,.15);
    }
    #site-nav .nav-links > li > a.nav-active {
      color: var(--navy, #0f1d2f);
      background: rgba(200,148,74,.14); border-color: rgba(200,148,74,.2);
    }

    /* Language toggle — sliding segmented control */
    #site-nav .lang-sw {
      position: relative; display: inline-flex; align-items: center;
      background: var(--stone, #ece6d8); border-radius: 100px; padding: 3px; gap: 1px;
    }
    #site-nav .lang-thumb {
      position: absolute; top: 3px; left: 3px; width: 30px; height: calc(100% - 6px);
      background: var(--navy, #0f1d2f); border-radius: 100px; z-index: 0;
      transition: transform .35s cubic-bezier(.22,.68,0,.71);
    }
    #site-nav .lang-sw.uz-active .lang-thumb { transform: translateX(31px); }
    #site-nav .lang-sw button {
      position: relative; z-index: 1; width: 30px; padding: 6px 0; background: none; border: none; cursor: pointer;
      font-family: 'DM Sans', -apple-system, sans-serif;
      font-size: .68rem; font-weight: 700;
      color: var(--text-light, #948d7c); transition: color .3s; letter-spacing: .03em;
    }
    #site-nav .lang-sw button.active { color: #fff; }

    /* Hamburger */
    #site-nav .nav-hamburger {
      display: none; background: none; border: none; cursor: pointer; padding: 8px;
    }
    #site-nav .nav-hamburger span {
      display: block; width: 22px; height: 2px;
      background: var(--navy, #0f1d2f); margin: 5px 0; border-radius: 2px;
    }
    #site-nav .nav-right { display: flex; align-items: center; gap: .85rem; }

    /* Mobile */
    @media (max-width: 900px) {
      #site-nav .nav-links {
        display: none; position: absolute; top: 72px; left: 0; right: 0;
        flex-direction: column; align-items: stretch; background: rgba(250,249,245,.98);
        backdrop-filter: blur(20px); padding: 1rem 1.5rem; gap: .25rem;
        border-bottom: 1px solid var(--border, #e6e0d0);
      }
      #site-nav .nav-links.open { display: flex; }
      #site-nav .nav-links > li > a { width: 100%; }
      #site-nav .nav-hamburger { display: block; }
    }

    /* Language visibility — applies globally */
    [data-lang="uz"] { display: none; }
    body.uz [data-lang="en"] { display: none; }
    body.uz [data-lang="uz"] { display: inline; }
    body.uz [data-lang="uz"].block { display: block; }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ─────────────────────────────────────────────────────────────
  const nav = document.createElement('nav');
  nav.id = 'site-nav';
  nav.innerHTML = `
    <a href="${isHome ? '#' : 'index.html'}" class="nav-logo">Otabek Pulatov<span>,</span> MD</a>
    <ul class="nav-links" id="siteNavLinks">
      <li data-group="about">
        <a href="${a('#about')}">
          <span data-lang="en">About</span><span data-lang="uz">Men haqimda</span>
        </a>
      </li>
      <li data-group="journey">
        <a href="journey.html">
          <span data-lang="en">Journey</span><span data-lang="uz">Yo'lim</span>
        </a>
      </li>
      <li data-group="writing">
        <a href="writing.html">
          <span data-lang="en">Writing</span><span data-lang="uz">Maqolalar</span>
        </a>
      </li>
      <li data-group="research">
        <a href="research.html">
          <span data-lang="en">Research</span><span data-lang="uz">Tadqiqot</span>
        </a>
      </li>
      <li data-group="hub">
        <a href="hub.html">
          <span data-lang="en">Uzbek Health Hub</span><span data-lang="uz">O'zbek sog'liq markazi</span>
        </a>
      </li>
    </ul>
    <div class="nav-right">
      <div class="lang-sw" id="siteLangSw">
        <span class="lang-thumb"></span>
        <button class="active" onclick="setLang('en')">EN</button>
        <button onclick="setLang('uz')">UZ</button>
      </div>
      <button class="nav-hamburger" id="siteNavHamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  // ── Scroll effect ────────────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── Hamburger ────────────────────────────────────────────────────────────────
  document.getElementById('siteNavHamburger').addEventListener('click', () => {
    document.getElementById('siteNavLinks').classList.toggle('open');
  });

  // ── Highlight current section in nav ─────────────────────────────────────────
  const curFile = path.split('/').pop() || 'index.html';
  const groupFor = (file) => {
    if (file.startsWith('journey')) return 'journey';
    if (file.startsWith('topic-') || file.startsWith('blog-') || file === 'writing.html') return 'writing';
    if (file === 'research.html' || file === 'cv.html') return 'research';
    if (file.startsWith('hub') || file === 'uzmedtalks.html') return 'hub';
    return isHome ? 'about' : '';
  };
  const activeGroup = groupFor(curFile);
  if (activeGroup) {
    const li = nav.querySelector(`.nav-links li[data-group="${activeGroup}"] > a`);
    if (li) li.classList.add('nav-active');
  }

  // ── Global setLang — works for all pages ─────────────────────────────────────
  window.setLang = function (lang) {
    document.body.classList.toggle('uz', lang === 'uz');
    document.querySelectorAll('.lang-sw button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.lang-sw').forEach(sw => sw.classList.toggle('uz-active', lang === 'uz'));
    if (event && event.target) event.target.classList.add('active');
    else document.querySelectorAll(`.lang-sw button:${lang === 'uz' ? 'last' : 'first'}-child`).forEach(b=>b.classList.add('active'));
  };

})();
