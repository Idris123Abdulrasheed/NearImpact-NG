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
to their communities — starting now, not eventually.

---

## 🛠️ Current Tech Stack

**Frontend:**
- [Vite](https://vite.dev/) — dev server and build tooling
- Vanilla JavaScript — no framework right now
- Plain CSS, built around a shared set of design tokens (colors, type)
  rather than utility classes. [Tailwind CSS](https://tailwindcss.com/)
  is on the radar for later as the UI grows, but isn't in use yet.

**Backend:** still taking shape. The current experiment is serverless
JS functions on Vercel (`api/`, `lib/db.js`) — quick to build and ship
alongside the frontend on the same platform. PHP, likely with Laravel,
is the direction we'd move toward for a more traditional backend if
that ends up being the better fit; which path we settle on partly comes
down to hosting and cost. This README will be updated once that's
decided for real.

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
├── api/                    → Vercel serverless functions (current backend experiment)
│   └── search.js
├── docs/
│   └── CODING_STANDARDS.md
├── lib/
│   └── db.js
├── public/                 → static assets served as-is
│   ├── partners/
│   ├── projects/
│   ├── sdgs/
│   ├── socials/
│   ├── Impactmakers/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              → images imported directly into JS (brand, hero)
│   ├── modules/             → one section/feature per file
│   │   ├── data/             → static/query data (projects, geo, icons, type-meta)
│   │   ├── state/            → shared app state (e.g. map-store.js)
│   │   ├── styles/           → one CSS file per module, same name
│   │   ├── ui/               → small reusable UI pieces (e.g. toast.js)
│   │   ├── nav.js, hero.js, projects.js, map.js, ...
│   │   └── main.js
│   └── main.js
├── .env / .env.example
├── index.html
├── package.json
└── README.md
```

Each homepage section is a module: a `render<Section>()` function paired
with a same-named stylesheet. The structure will keep evolving as the
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

No license has been chosen yet — this will be added as the project
develops.



















# NearImpact Nigeria

NearImpact Nigeria is a student-led sustainability and community-impact
initiative starting in Nigeria, with a long-term vision to grow across
Africa.

We turn students' ideas, skills, and passion into practical community
impact — helping them identify real problems around their schools and
communities, collaborate on solutions, build practical projects, and
connect their work to the United Nations Sustainable Development Goals
(SDGs).

The platform is being built to make that easier: a place to discover
opportunities, share ideas, collaborate on projects, and create
measurable impact in the communities around you.

---

## Mission

> To empower students to turn ideas and skills into practical solutions
> for real community problems while creating meaningful impact aligned
> with the Sustainable Development Goals.

The problems closest to us are opportunities to create impact. Students
shouldn't have to wait until graduation to make a difference. By giving
them the tools, community, and opportunities to act, NearImpact aims to
build a generation of young people capable of identifying problems,
building solutions, and contributing meaningfully to their communities —
starting now, not eventually.

---

## Current tech stack

**Frontend**
- [Vite](https://vite.dev/) — dev server and build tooling
- Vanilla JavaScript, no framework
- Plain CSS, built around a shared set of design tokens (colors, type)
  rather than utility classes. [Tailwind](https://tailwindcss.com/) is on
  the radar for later, not in use yet.

**Backend**
- Still undecided. The current experiment is serverless JS functions on
  Vercel (`api/`, `lib/db.js`) — quick to build and ship alongside the
  frontend on the same platform. PHP (likely Laravel) is the other
  option on the table for a more traditional setup. Which one we settle
  on partly comes down to hosting and cost. This README gets updated
  once that's actually decided — until then, don't treat either as final.

**Tooling**
- Git & GitHub for version control and collaboration.

---

## Getting started

1. Clone the repository
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the dev server
   ```
   npm run dev
   ```
   Vite prints a local URL, typically `http://localhost:5173`.

---

## Project structure

```
nearimpact/
├── api/                     → Vercel serverless functions (current backend experiment)
│   └── search.js
├── docs/
│   └── CODING_STANDARDS.md
├── lib/
│   └── db.js
├── public/                  → static assets served as-is
│   ├── partners/
│   ├── projects/
│   ├── sdgs/
│   ├── socials/
│   ├── impactmakers/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               → images imported directly into JS (brand, hero)
│   ├── modules/               → one section/feature per file
│   │   ├── data/                → static/query data (projects, geo, icons, type-meta)
│   │   ├── state/                → shared app state (e.g. map-store.js)
│   │   ├── styles/                → one CSS file per module, same name
│   │   ├── ui/                     → small reusable UI pieces (e.g. toast.js)
│   │   └── nav.js, hero.js, project-list.js, map.js, ...
│   └── main.js                → imports every module + its CSS, assembles the page
├── .env / .env.example
├── index.html
├── package.json
└── README.md
```

Each homepage section is a module: a `render<Section>()` function paired
with a same-named stylesheet. This tree reflects what's actually here
today, not a plan — it'll keep changing as the project grows.

---

## Coding standards

All contributors follow the project's conventions — naming, file
structure, CSS/BEM, commenting style, commits, general code quality.

Full doc: [`docs/CODING_STANDARDS.md`](docs/CODING_STANDARDS.md)

---

## Contributing

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

## Our vision

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

## License

No license has been chosen yet — this will be added as the project
develops.
