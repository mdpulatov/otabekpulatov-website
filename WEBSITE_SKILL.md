# Website Editing Guide — WEBSITE_SKILL.md
*Otabek Pulatov, MD — otabekpulatov.com*
*Last updated: 2026-03-20*

---

## Overview

The website is a collection of plain HTML files — no build system, no framework, no CMS. Every change is a direct edit to an `.html` or `.js` file. All pages share the same CSS design language (navy/gold/warm-white palette, Playfair Display + DM Sans fonts).

**Key architectural facts:**
- **Navigation** is now managed by one file: `nav.js`. To change any nav item across the entire site, edit only `nav.js`. Sub-pages each have `<script src="nav.js"></script>` as their first body element. `index.html` still has its nav inline.
- **Bilingual toggle (EN/UZ)** is powered by `data-lang="en"` / `data-lang="uz"` attribute pairs throughout all pages. The CSS to hide/show them is injected globally by `nav.js`. Always write both languages.
- **setLang()** is a global function defined in `nav.js` — sub-pages do not define their own. `index.html` has its own copy.

---

## Site Architecture at a Glance

```
Website/
├── nav.js              ← SHARED NAV — edit this to change nav on all sub-pages
├── index.html          ← Homepage (hero, about, journey, topics, research, blog, hub, contact)
│                          Has its own inline nav — also update nav.js when changing nav items
├── cv.html             ← Curriculum Vitae
├── research.html       ← Full publications list with PDFs
├── uzmedtalks.html     ← UzMedTalks podcast landing page (dark theme, coming-soon episodes)
│
├── hub-cardio.html     ← Cardiovascular Health curated hub (filterable cards: research, episodes, articles)
├── hub-mental-health.html ← Mental Health curated hub
├── hub-autism.html     ← Autism & Neurodevelopment curated hub
├── hub-immigrant.html  ← Immigrant Worker Health curated hub (includes resources type)
│
├── hub-directory.html  ← Searchable provider directory (Supabase backend)
├── hub-education.html  ← Occupational health articles
├── hub-network.html    ← Professional network page
├── hub-submit.html     ← Provider submission form (Supabase + EmailJS)
│
├── journey-pa-school.html
├── journey-pa-career.html
├── journey-medical-school.html
├── journey-choosing-specialty.html
├── journey-residency.html
├── journey-uz-vs-usa.html
│
├── topic-autism.html
├── topic-mental-health.html
├── topic-substances.html
├── topic-clinical-reasoning.html
├── topic-history-medicine.html
│
├── hero-transparent.png
└── pdfs/
    ├── pulatov-demikhov.pdf
    ├── pulatov-mirna-30c.pdf
    ├── pulatov-ash1l.pdf
    └── pulatov-tapia.pdf
```

---

## 1. Updating the Navigation (nav.js)

**The only file to edit for nav changes is `nav.js`.** All sub-pages load it automatically. `index.html` has its nav inline — mirror any changes there too.

### Add a link to an existing dropdown

Open `nav.js`, find the right `dd-menu-inner` block, and add one line:
```js
<a href="your-new-page.html"><span data-lang="en">Page Title</span><span data-lang="uz">Sahifa nomi</span></a>
```

The five dropdown groups are:
- **Journey** → journey articles
- **Health Topics** → hub pages + topic articles
- **Research** → research.html, cv.html, topic-clinical-reasoning.html, topic-history-medicine.html
- **Uzbek Hub** → hub-directory, hub-network, hub-education

### Add a top-level nav item

In `nav.js`, find the `<ul class="nav-links">` section and add a new `<li>` in the right position:
```js
<li>
  <a href="new-page.html"><span data-lang="en">Label EN</span><span data-lang="uz">Label UZ</span></a>
</li>
```

### How nav.js works

- Detects if the current page is the homepage (`index.html` or `/`) and adjusts anchor links automatically: `#topics` on home, `index.html#topics` on all other pages
- Injects all nav CSS scoped to `#site-nav` — no conflicts with page CSS
- Defines `window.setLang(lang)` globally — called by `onclick="setLang('en')"` / `onclick="setLang('uz')"`
- Highlights the current page in the dropdown by matching the filename
- Handles scroll effect (nav background darkens), hamburger mobile toggle

### Adding nav.js to a brand new page

Add this as the **very first element inside `<body>`**:
```html
<body>
<script src="nav.js"></script>
<!-- rest of page -->
```
That's it. No other nav HTML or CSS needed.

---

## 2. Adding a New Publication

A new publication must be added in **three places**: `research.html` (full card), `cv.html` (compact entry), and `index.html` (preview list).

### Step 1 — Save the PDF
Name the file: `pdfs/pulatov-[short-topic-keyword].pdf`
Example: `pdfs/pulatov-sglt2-hf.pdf`

### Step 2 — Add full card to `research.html`

**Where:** Inside `<div class="content">`, before existing cards. Add newest paper first (top).

```html
<div class="pub-card">
  <span class="pub-status published" data-lang="en">Published · [Journal Name]</span>
  <span class="pub-status published" data-lang="uz">Nashr etilgan · [Journal Name]</span>
  <h2>[Full paper title]</h2>
  <div class="pub-meta"><strong>Pulatov O</strong>, [Co-author Last F], [Co-author Last F].</div>
  <div class="pub-journal">[Journal]. [Year];[Vol]([Issue]):[Pages]. DOI: [DOI]</div>
  <div class="pub-tags-row">
    <span class="pub-tag">First Author</span>
    <span class="pub-tag">[Specialty]</span>
  </div>
  <div class="abstract">
    <h3 data-lang="en">Abstract</h3>
    <h3 data-lang="uz">Annotatsiya</h3>
    <p><strong>Background:</strong> [1-2 sentences]</p>
    <p><strong>Methods/Case:</strong> [2-3 sentences]</p>
    <p><strong>Conclusion:</strong> [1-2 sentences]</p>
  </div>
  <button class="pdf-toggle" onclick="togglePdf('pdf[N]')">
    <span data-lang="en">Read full article (PDF)</span>
    <span data-lang="uz">To'liq maqolani o'qish (PDF)</span>
    <span class="arrow">&#9662;</span>
  </button>
  <div class="pdf-box" id="pdf[N]">
    <object data="pdfs/pulatov-[slug].pdf" type="application/pdf"></object>
  </div>
</div>
```

**Status badge options:**
| Status | Class | EN | UZ |
|--------|-------|----|----|
| Published | `pub-status published` | `Published · [Journal]` | `Nashr etilgan · [Journal]` |
| Accepted | `pub-status accepted` | `Accepted · [Journal]` | `Qabul qilingan · [Journal]` |
| Under Review | `pub-status review` | `Under Review · [Journal]` | `Ko'rib chiqilmoqda · [Journal]` |
| In Progress | `pub-status progress` | `In Progress` | `Jarayonda` |

**PDF ID:** Existing cards use `pdf1`–`pdf4`. Next new card = `pdf5`, then `pdf6`, etc.

### Step 3 — Add compact entry to `cv.html`

**Where:** Inside the "Publications" `cv-group` div. Add newest first.
```html
<div class="cv-pub">
  <span class="badge [published|accepted|review|progress]">[Status]</span>
  <h4>[Short title]</h4>
  <div class="authors"><strong>Pulatov O</strong>, [Co-author], et al.</div>
  <div class="journal">[Journal Name, Year]</div>
</div>
```

### Step 4 — Add preview to `index.html`

**Where:** Inside `<section class="research-sec" id="research-section">` → `<div class="pub-list">`. Newest first. Only published and accepted papers.
```html
<div class="pub-item fade-in">
  <span class="pub-badge [published|accepted]">[Status] · [Journal]</span>
  <div class="pub-t">[Full paper title]</div>
  <div class="pub-a"><strong>Pulatov O</strong>, [Co-author], et al.</div>
  <div class="pub-tags"><span class="pub-tag">First Author</span></div>
</div>
```

### Step 5 — Add card to a topic hub (optional)

If the paper fits a hub (e.g. cardiology paper → hub-cardio.html), add a content card to that hub page. See **Section 5: Updating Topic Hubs** below.

---

## 3. Updating the About Page Bio

**File:** `index.html`
**Where:** `<section class="about" id="about">` → `<div class="about-text fade-in" data-lang="en">` and matching `data-lang="uz"` div.

Edit the `<p>` tags directly. Always maintain both language versions.

The **hero statement** (one-liner at top of page) is in the hero section:
- H1: `<h1 data-lang="en">The bridge between Central Asian communities and <em>American medicine.</em></h1>`
- Sub: `<p class="hero-sub" data-lang="en">`

---

## 4. Adding UzMedTalks Episodes

UzMedTalks has a dedicated page: **`uzmedtalks.html`**.

### To add a real episode (when recorded)

**File:** `uzmedtalks.html`
**Where:** Inside `<div class="ep-grid">`, add a new episode card at the top (newest first). Replace the matching "coming soon" placeholder if one exists.

**Template — live episode:**
```html
<a href="[YouTube or Spotify URL]" target="_blank" class="ep-card fade-in">
  <div class="ep-num">EPISODE 00N</div>
  <div><span class="ep-badge live" data-lang="en">Watch Now</span><span class="ep-badge live" data-lang="uz">Ko'rish</span></div>
  <div class="ep-title" data-lang="en">[Episode Title EN]</div>
  <div class="ep-title" data-lang="uz">[Episode Title UZ]</div>
  <p class="ep-desc" data-lang="en">[2-3 sentence description EN]</p>
  <p class="ep-desc" data-lang="uz">[2-3 sentence description UZ]</p>
  <div class="ep-tags"><span class="ep-tag">[Topic 1]</span><span class="ep-tag">[Topic 2]</span></div>
  <div class="ep-foot"><span class="ep-dur">~[X] min</span><span>[Month YYYY]</span></div>
</a>
```

**Coming-soon card template** (same but `class="ep-card soon"` and badge `class="ep-badge soon"`):
```html
<div class="ep-card soon fade-in">
  <div class="ep-num">EPISODE 00N</div>
  <div><span class="ep-badge soon" data-lang="en">Coming Soon</span><span class="ep-badge soon" data-lang="uz">Tez kunda</span></div>
  <div class="ep-title" data-lang="en">[Title EN]</div>
  <div class="ep-title" data-lang="uz">[Title UZ]</div>
  <p class="ep-desc" data-lang="en">[Description EN]</p>
  <p class="ep-desc" data-lang="uz">[Description UZ]</p>
  <div class="ep-tags"><span class="ep-tag">[Topic]</span></div>
  <div class="ep-foot"><span class="ep-dur">~45 min</span><span>[Launch date or "2026"]</span></div>
</div>
```

---

## 5. Updating Topic Hub Pages

The four topic hubs are `hub-cardio.html`, `hub-mental-health.html`, `hub-autism.html`, `hub-immigrant.html`.

Each hub has:
- A header with title, subtitle, and stat counters
- A sticky filter bar (All / Articles / Episodes / Research / Resources)
- A content grid of cards with `data-type="article|episode|research|resource"`
- A related hubs section at the bottom

### Add a new content card to a hub

**Where:** Inside `<div class="content-grid">`. Add newest content at top.

**Live article/research card (clickable):**
```html
<a href="[URL or PDF path]" target="_blank" class="content-card fade-in" data-type="[article|research|resource]">
  <div class="card-type [article|research|resource]" data-lang="en">[Badge EN]</div>
  <div class="card-type [article|research|resource]" data-lang="uz">[Badge UZ]</div>
  <h3 class="card-title" data-lang="en">[Title EN]</h3>
  <h3 class="card-title" data-lang="uz">[Title UZ]</h3>
  <p class="card-desc" data-lang="en">[Description EN]</p>
  <p class="card-desc" data-lang="uz">[Description UZ]</p>
  <div class="card-foot">
    <span class="card-lang">EN</span>
    <span class="card-status" data-lang="en">[Published · Journal or Available]</span>
    <span class="card-status" data-lang="uz">[Nashr etilgan · Journal or Mavjud]</span>
  </div>
</a>
```

**Coming-soon card (not clickable):**
```html
<div class="content-card coming-soon-card fade-in" data-type="[episode|article]">
  <div class="card-type [episode|article]" data-lang="en">[Badge EN]</div>
  <div class="card-type [episode|article]" data-lang="uz">[Badge UZ]</div>
  <h3 class="card-title" data-lang="en">[Title EN]</h3>
  <h3 class="card-title" data-lang="uz">[Title UZ]</h3>
  <p class="card-desc" data-lang="en">[Description EN]</p>
  <p class="card-desc" data-lang="uz">[Description UZ]</p>
  <div class="card-foot">
    <span class="card-lang">EN+UZ</span>
    <span class="card-status" data-lang="en">Coming Soon · UzMedTalks</span>
    <span class="card-status" data-lang="uz">Tez Kunda · UzMedTalks</span>
  </div>
</div>
```

**Badge type → CSS class mapping:**
| Content type | `data-type` | `class` | Color |
|---|---|---|---|
| Article | `article` | `card-type article` | Sky blue |
| Episode | `episode` | `card-type episode` | Amber |
| Research | `research` | `card-type research` | Green |
| Resource | `resource` | `card-type resource` | Lavender |

### Update hub stat counters

In the `<div class="hub-stats">` section, update the `<div class="stat-number">` values when adding content.

### Create a new hub page

1. Copy `hub-cardio.html` as a template
2. Update `<title>`, hub-title, hub-subtitle, hub-label, hub-stats
3. Replace the SVG icon in `<div class="hub-emoji">` with an appropriate line SVG
4. Replace all content cards with relevant content
5. Update the related hubs section at the bottom
6. Add to `nav.js` under the Health Topics dropdown
7. Add a hub-feat card to `index.html`'s Hub section
8. Add to `index.html`'s topics grid if appropriate

---

## 6. Adding a New Topic Article

1. Copy `topic-autism.html`, rename to `topic-[keyword].html`
2. Update `<title>`, article header EN/UZ text, and article body
3. Add a card to `index.html` topics grid (replace a "Coming Soon" card if possible):
```html
<a class="topic-card fade-in" href="topic-[keyword].html">
  <h4 data-lang="en">[Title EN]</h4><h4 data-lang="uz">[Title UZ]</h4>
  <p data-lang="en">[1-line description EN]</p><p data-lang="uz">[1-line description UZ]</p>
  <span class="topic-lang both">EN + UZ</span>
</a>
```
4. Add to `nav.js` under the Health Topics dropdown

---

## 7. Adding a New Journey Article

1. Copy `journey-residency.html`, rename to `journey-[topic].html`
2. Update `<title>`, header, and article content
3. **Add to `nav.js`** under the Journey dropdown (one `<a>` line)
4. Mirror the same change in `index.html`'s inline nav (Journey dropdown, same location)
5. Optionally add a timeline card to `index.html` journey section (tl6, tl7, etc.)

---

## 8. Adding a Blog Post

1. Copy a topic article, name it `blog-[slug].html`
2. Update the blog card in `index.html` (`#blog` section) — change `href="#"` to `href="blog-[slug].html"`

---

## 9. Updating CV Sections

All CV content is in `cv.html`.

**New clinical role / education entry:**
```html
<div class="cv-entry">
  <h3>[Institution Name]</h3>
  <div class="role">[Role Title]</div>
  <div class="details">[2-3 sentences]</div>
  <div class="date">[Month YYYY — Month YYYY] <span class="loc">· [City, State]</span></div>
</div>
```

**New presentation:**
```html
<div class="cv-pres">
  <h4>[Talk/Poster Title]</h4>
  <p>[Oral/Poster] · [Conference] · [Month YYYY], [City]</p>
</div>
```

**New honor / certification / membership:** Append a `<span class="pill">` to the relevant pills group.

---

## 10. Language Toggle — Rules

Every user-visible text node must appear **twice**: `data-lang="en"` and `data-lang="uz"`. The CSS (injected by `nav.js` globally) hides the inactive language using the `body.uz` class.

```html
<!-- Block elements -->
<h2 data-lang="en">Title in English</h2>
<h2 data-lang="uz">O'zbek tilidagi sarlavha</h2>

<!-- Paragraphs -->
<p data-lang="en">English paragraph.</p>
<p data-lang="uz">O'zbek matni.</p>

<!-- Inline text -->
<span data-lang="en">English</span><span data-lang="uz">O'zbek</span>
```

**Rule:** If you add English content without a UZ twin, it will disappear when users switch to Uzbek. If the translation isn't ready yet, copy the English text as a placeholder.

**Note:** The language CSS `[data-lang="uz"] { display:none }` etc. is now injected globally by `nav.js`. Individual pages do NOT need to include it in their `<style>` blocks (though leaving it as a duplicate is harmless).

---

## 11. Design System Reference

| Token | Value | Use |
|-------|-------|-----|
| `--navy` | `#0f1d2f` | Primary dark color, backgrounds, headings |
| `--gold` | `#c8944a` | Accent, labels, hover states |
| `--sky` | `#dbeafe` | Light blue backgrounds, badges |
| `--sky-light` | `#eff6ff` | Subtle hover backgrounds |
| `--warm-white` | `#fafbfc` | Page background |
| `--cream` | `#f8f6f3` | Abstract / callout backgrounds |
| `--text-secondary` | `#555e6e` | Body paragraph text |
| `--border` | `#e2e6ec` | All dividers and borders |
| `--font-display` | Playfair Display | All headings (h1–h3) |
| `--font-body` | DM Sans | All body text, labels, nav |
| `--font-mono` | JetBrains Mono | Dates, DOIs, codes |

Never introduce inline colors outside this palette. Match border-radius, padding, and gap conventions of nearby elements.

---

## 12. Quick-Reference Checklists

**Adding a publication:**
- [ ] PDF saved to `pdfs/pulatov-[slug].pdf`
- [ ] Full card added to `research.html` (correct pdf ID: pdf5, pdf6, ...)
- [ ] Compact entry added to `cv.html` Publications group
- [ ] Preview item added to `index.html` `#research-section`
- [ ] Optionally: content card added to relevant hub page
- [ ] All locations have both EN and UZ text

**Adding a UzMedTalks episode:**
- [ ] Episode URL (YouTube / Spotify) ready
- [ ] New `ep-card` added to `uzmedtalks.html` ep-grid (top = newest)
- [ ] Coming-soon card removed or replaced
- [ ] Both EN and UZ title and description filled in
- [ ] Stat counters in hub header updated if applicable

**Adding any new page:**
- [ ] File named `[type]-[slug].html`
- [ ] `<script src="nav.js"></script>` as first element in `<body>`
- [ ] No nav HTML or nav CSS needed — `nav.js` handles it
- [ ] `<title>` tag updated
- [ ] All text has EN and UZ `data-lang` pairs
- [ ] Link to new page added in `nav.js` (+ mirrored in `index.html` nav if applicable)
- [ ] Card or link added on the homepage pointing to new page

**Updating the nav globally:**
- [ ] Edit `nav.js` only — all sub-pages update automatically
- [ ] Mirror the same change in `index.html`'s inline nav block
