# NearImpact Nigeria 🌍

NearImpact Nigeria is a student-led sustainability and community-impact
initiative starting in Nigeria, with a long-term vision to grow across
Africa.

We turn students' ideas, skills, and passion into practical community
impact; helping them identify real problems around their schools and
communities, collaborate on solutions, build practical projects, and
connect their work to the United Nations Sustainable Development Goals
(SDGs).

The platform itself is being built to make that easier: a place to
discover opportunities, share ideas, collaborate on projects, and create
measurable impact in the communities around you.

---

## 🎯 Mission

> To empower students to turn ideas and skills into practical solutions
> for real community problems while creating meaningful impact aligned
> with the Sustainable Development Goals.

It starts from a simple idea: **the problems closest to us are
opportunities to create impact.**

Students shouldn't have to wait until graduation to make a difference.
By giving them the tools, community, and opportunities to act,
NearImpact aims to build a generation of young people capable of
identifying problems, building solutions, and contributing meaningfully
to their communities.

---

## 🛠️ Current Tech Stack

**Frontend:**
- [Vite](https://vite.dev/): dev server and build tooling
- Vanilla JavaScript: no framework right now
- Plain CSS, built around a shared set of design tokens (colors, type)
  rather than utility classes. [Tailwind CSS](https://tailwindcss.com/)
  will be used later as the UI grows, but not in use yet.

**Backend:** serverless JS functions on Vercel (`api/`, `lib/`) with
MySQL on Aiven and cookie-JWT auth; quick to build and ship alongside
the frontend on the same platform.

**Tooling:** Git & GitHub for version control and collaboration.

---

## 🚀 Getting Started

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start the dev server**
   ```
   npm run dev
   ```
   Vite will print a local URL, typically `http://localhost:5173`.

---

## 📁 Project Structure

```
nearimpact/
├── index.html, about.html, privacy.html, terms.html, login.html (sign in + create account), sdg.html, sdgs.html
├── list-project.html, impactmakers.html, impactmaker.html,
│   become-impactmaker.html, all-opportunities.html, all-projects.html,
│   detail.html            → one HTML entry per page (listed in vite.config.js)
├── vite.config.js / package.json / README.md
├── api/                    → Vercel serverless functions
│   ├── auth/ (login.js, logout.js, me.js, register.js)
│   └── impactmakers.js, listings.js, newsletter.js, opportunities.js,
│       projects.js, search.js
├── db/                     → schema + seed SQL, run manually per file
├── certs/                  → Aiven CA certificate
├── lib/                    → auth.js (bcrypt + JWT), db.js (MySQL pool)
├── docs/
│   └── CODING_STANDARDS.md
├── public/                 → static assets served as-is
│   ├── partners/, projects/, sdgs/, socials/, impactmakers/
│   └── favicon.svg, icons.svg
└── src/
    ├── main.js             → homepage entry
    ├── pages/              → one module per HTML entry (page-shell.js + about.js, ...)
    ├── assets/             → images imported directly into JS (brand, hero)
    └── modules/            → one section/feature per file
        ├── data/            → static/query data, icons, type-meta, geo
        ├── state/           → shared app state (map-store.js)
        ├── ui/              → small reusable pieces (toast, loader, pagination,
        │                      password-toggle, form-draft, cards, escape-html)
        ├── styles/          → one CSS file per module, same name, plus:
        │                      base.css (tokens) and glass.css (shared form surface)
        └── nav.js, hero.js, list-project.js, auth-form.js (the sign-in card),
        login-page.js (body of /login), ...
```

Each section or page body is a module: a `render<Section>()` function
paired with a same-named stylesheet. Every form shares one look through
`modules/styles/glass.css` (frosted panel, fields, buttons), driven by
the `--glass-*` tokens in `base.css`. The structure will keep evolving as the
project grows — this tree reflects what's actually here today, not a
plan.

---

## 📖 Coding Standards

All contributors should follow the project's conventions — naming, file
structure, CSS/BEM, commenting style, commits, and general code quality.

Full doc: [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md)

---

## 🤝 Contributing

1. Read the [Coding Standards](docs/CODING_STANDARDS.md).
2. Create a branch for your work.
3. Keep commits focused and descriptive.
4. Test your changes locally.
5. Make sure your changes don't introduce unnecessary errors or breaking
   changes.
6. Open a pull request with a clear description of what changed and why.

```
git checkout -b feat/project-discovery
git commit -m "feat: add project discovery page"
```

---

## 🌱 Our Vision

NearImpact Nigeria is starting with students and communities around us,
but the long-term vision is bigger. We want to build a platform where
young people across Africa can:

- Discover real problems in their communities
- Find other students who share their interests
- Turn ideas into practical projects
- Collaborate across schools and communities
- Connect projects to the SDGs
- Discover opportunities to learn and contribute
- Measure and showcase their impact

**Start near. Create impact. Grow beyond.**

---

## 📄 License

No license has been chosen yet.