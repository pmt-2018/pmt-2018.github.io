# AGENTS.md

## 1. Project Overview

This repository is a **personal academic homepage** with three main roles:

1. A personal academic homepage / profile.
2. A teaching-resource area, primarily for students.
3. A long-term archive of algorithm / competitive-programming notes.

The site is **not primarily a blog** and **not primarily a standalone course website**. Teaching is an important section of the personal homepage, but it must remain integrated with the overall site.

The current main teaching context is **Nanjing University Problem Solving**, a first-year major course containing both theory and C++ programming. The site owner's teaching-assistant work focuses more heavily on the programming part. Because students are historically expected to learn much of the programming material independently, the Teaching section should provide detailed, practical self-study material and OJ solution/explanation resources.

Primary audiences, in approximate priority order:

1. Students using teaching materials.
2. People interested in the technical/algorithm content.
3. Visitors using the site as a long-term personal archive/reference.

Graduate-school recruiting and job recruiting are currently secondary concerns and should not drive the design.

---

## 2. Core Product Principles

When making implementation or design decisions, prefer the following:

- **Content first.**
- **Static-first architecture.**
- **Low maintenance burden.**
- **Good reading experience over visual effects.**
- **Markdown/MDX should be the normal authoring workflow.**
- **Teaching materials should be easy for first-year students to navigate.**
- **Features should degrade gracefully and should not make core content dependent on JavaScript when avoidable.**
- Avoid unnecessary infrastructure, services, databases, CMSs, authentication systems, and server-side dependencies.
- Do not turn the project into a general-purpose blogging platform or a web IDE without an explicit requirement.
- Prefer simple implementations that can still be understood and maintained after months without touching the repository.

The expected maintenance level is roughly **Level 0–1**: the owner can maintain code when necessary, but routine content updates should not require understanding a complicated framework or deployment pipeline.

---

## 3. Baseline Technology Direction

The preferred baseline is:

- **Astro** — static site framework.
- **MDX** — primary content format where components are needed.
- **Markdown** — acceptable/preferred where plain Markdown is sufficient.
- **Astro Content Collections** — structured content management.
- **Tailwind CSS** — styling, if it remains lightweight and useful.
- **KaTeX** — required mathematical notation support.
- **Shiki** — required syntax highlighting for code.
- **GitHub Pages** — deployment target.
- **GitHub Actions** — build/deployment automation.

The final deployed site should remain a static site.

Do not introduce a backend merely to implement convenience features.

Optional future features include:

- Mermaid diagrams.
- Pagefind or equivalent static search.
- RSS.
- Lightweight commenting only if there is a later explicit need.
- Interactive C++ examples described in Section 11.

Dark mode is not currently required.

Automatic CV PDF generation is not required.

Multilingual/i18n infrastructure is not required.

Jupyter Notebook integration is not required.

---

## 4. Information Architecture

Target top-level structure:

```text
/
├── Home
├── About
├── CV
├── Teaching
│   └── NJU Problem Solving
│       ├── <Semester>
│       │   ├── Overview
│       │   ├── Schedule
│       │   ├── Lectures / Notes
│       │   ├── Labs / Exercises
│       │   ├── OJ Solutions
│       │   └── FAQ
│       └── Archive
└── Notes
    ├── Data Structures
    ├── Graph
    ├── DP
    ├── Tools / Writing
    └── Others
```

Do not add a top-level `Blog` unless requirements change. Content is primarily organized semantically, not as a chronological feed.

Algorithms and general notes are merged into one Notes section, using the `notes`
content collection and topic categories. Do not restore a separate Algorithms
navigation item or collection unless explicitly requested. Existing algorithm URLs
are retained as static redirects to the corresponding Notes pages.

---

## 5. Homepage and Visual Direction

The overall visual direction is an **academic homepage**, not a portfolio landing page or modern marketing site.

Prefer:

- Strong typography.
- Generous whitespace.
- Restrained visual hierarchy.
- Simple navigation.
- Documentation-oriented layouts for teaching material.
- Fast loading.
- Accessible HTML.
- Minimal animation.

Avoid by default:

- Hero sections occupying most of the viewport.
- Large decorative banners.
- Excessive cards.
- Heavy animation.
- Visual effects that interfere with reading.
- A design that makes Teaching look like a completely separate branded website.

Teaching should visually belong to the same personal site.

A course page may use a documentation-style sidebar/navigation while retaining the site's overall visual language.

---

## 6. Teaching Content Model

Teaching content is organized around **course offerings / semesters**, rather than pretending to be a permanent C++ textbook.

Example:

```text
Teaching
└── NJU Problem Solving
    ├── 2026 Fall
    ├── 2027 Spring
    └── Archive
```

当前开课学期为 **2026 Fall / 2026 秋**，路径使用 `2026-fall`。之前的 `2026-spring` 占位材料已删除，不作为课程归档保留。

Each semester is conceptually independent.

Do not over-engineer cross-semester versioning. The owner does not currently intend to maintain one continuously versioned course site for many years.

A semester may be archived, simplified, or removed when it is no longer useful.

The Teaching section should primarily support the student's course workflow:

```text
course overview
→ weekly material
→ programming examples
→ exercises / labs
→ OJ
→ FAQ / debugging help
```

For introductory C++ teaching, practical topics such as environment setup, compilation, debugging, compiler errors, OJ submission, and common mistakes are important.

---

## 7. OJ Solutions

The main OJ is the **Nanjing University internal OJ**. Some visitors may not have access to the original problem statement.

Do not automatically copy full internal OJ problem statements into this repository.

A solution page should normally identify the problem sufficiently for enrolled students and focus on the educational explanation.

Preferred solution structure:

```text
Problem / Reference
Observation
Solution
Code
Complexity
Common Mistakes
```

Code should normally be displayed directly on the page rather than requiring the student to navigate to another repository.

Example conceptual frontmatter:

```yaml
---
title: "Example Problem"
course: "nju-problem-solving"
semester: "2026-fall"
week: 3
category: "oj"
tags:
  - array
  - loop
published: true
releaseDate: 2026-04-10
---
```

The exact schema may evolve, but keep it small and understandable.

### Delayed publication

OJ answers may need to remain unavailable until an appropriate time.

Content should support fields such as:

```yaml
published: false
releaseDate: 2026-07-01
```

The build/content layer may filter unreleased content.

Do not rely on client-side hiding for sensitive/unreleased answers. If material should not be public, it should not be emitted into the public static build.

Manual publication is also acceptable.

At the end of a semester, solution material may be made public, archived, or deleted manually.

Remember that Git history is public if the repository is public. Do not commit material that must remain genuinely secret merely because the generated page is hidden.

---

## 8. Algorithm Notes

Algorithm notes belong to the unified Notes section, a longer-lived knowledge archive than semester teaching material.

Algorithm/problem-solution articles should favor the following structure where appropriate:

```text
Problem / Topic
Observation
Solution
Code
Complexity
Common Mistakes / Notes
```

Required capabilities:

- Markdown/MDX.
- LaTeX mathematics.
- C++ syntax highlighting.
- Tags/categories.

Do not force all algorithm material into a competition/date hierarchy. Organize primarily by useful topic/category.

---

## 9. Repository Direction

A reasonable target structure is:

```text
personal-site/
├── AGENTS.md
├── astro.config.mjs
├── package.json
├── public/
│   ├── images/
│   ├── files/
│   └── cpp-runtime/        # reserved for future optional playground assets
└── src/
    ├── components/
    │   └── playground/     # reserved for future interactive examples
    ├── layouts/
    ├── pages/
    └── content/
        ├── teaching/
        │   └── nju-ps/
        │       └── <semester>/
        └── notes/
            └── <topic>/
```

This is a direction, not an immutable directory contract. Agents may improve the exact Astro structure when implementation requires it, but should preserve the conceptual separation.

Prefer one integrated site/repository rather than deploying every semester as an unrelated website.

Typical URLs should resemble:

```text
/teaching/nju-ps/2026-fall/
/teaching/nju-ps/2026-fall/oj/...
/notes/graph/...
```

---

## 10. Development Priorities

Use approximately the following priority order.

### P0 — Site foundation

Must work first:

- Astro project.
- Static build.
- GitHub Pages deployment.
- Global layout/navigation.
- Responsive and readable typography.
- Basic Home / Teaching / Notes / About structure.

### P1 — Content system

Then establish:

- Markdown/MDX workflow.
- Content Collections/schema.
- KaTeX.
- Shiki C++ highlighting.
- Tags/categories.
- Semester/course metadata.
- Delayed publication behavior.

### P2 — Real teaching content

Then validate the architecture with actual material:

- One NJU Problem Solving semester.
- Weekly content.
- At least one OJ solution.
- FAQ/debugging material.
- Representative C++ examples.

### P3 — Polish and optional capabilities

Only after the core content workflow is comfortable:

- Better navigation.
- Pagefind/static search if content volume justifies it.
- Mermaid if useful.
- RSS if useful.
- Interactive C++ examples.

Do not allow P3 features to delay or complicate P0–P2 unnecessarily.

---

## 11. Future Interactive C++ Examples

### Status

Interactive C++ execution is a **planned optional enhancement**, not a prerequisite for the first version of the site.

The architecture should leave a clean extension point for it, but agents should **not implement a large playground/IDE as part of unrelated work**.

The intended use case is small educational examples such as:

- expressions;
- loops;
- functions;
- recursion;
- references;
- basic pointers;
- classes;
- `std::vector`;
- `std::string`;
- common STL algorithms;
- lambdas;
- small algorithm demonstrations.

OJ solutions and large programs should normally remain ordinary highlighted code blocks.

### UX goal

Eventually an author should be able to embed something conceptually similar to:

```mdx
<CppPlayground
  code={`
#include <iostream>

int main() {
    int n;
    std::cin >> n;

    for (int i = 0; i < n; ++i)
        std::cout << i << ' ';
}
`}
  stdin={`5`}
/>
```

The student-facing component should remain intentionally small:

```text
editable source code
stdin
Run
Reset
stdout / stderr / compiler diagnostics
```

It should be described as a way to **try an example**, not as a complete online C++ IDE.

### Preferred implementation direction

The current preferred direction is a **browser-side Clang/WebAssembly toolchain**, isolated behind the site's own `CppPlayground` abstraction.

A likely implementation may use a maintained Clang-to-WebAssembly/browser package such as `@live-codes/clang-wasm`, or another suitable implementation available when this feature is actually built.

Do **not** tightly couple MDX teaching content to a particular compiler package.

The dependency boundary should look approximately like:

```text
Teaching MDX
    ↓
<CppPlayground>
    ↓
site-owned playground API/component
    ↓
Web Worker
    ↓
browser C/C++ compiler + WASI runtime
```

This allows the compiler/runtime implementation to be replaced later without editing teaching articles.

Before implementing this feature, re-evaluate the current browser C++/WASM ecosystem rather than assuming the package named in this document is still the best maintained option.

### Static deployment requirement

The intended implementation must remain compatible with static hosting on GitHub Pages.

Runtime/compiler assets should be deployable as ordinary static resources such as:

```text
.js
.wasm
support/runtime files
```

No remote compilation backend should be introduced by default.

If future requirements genuinely need a server-side compiler, treat that as a separate architecture decision and obtain explicit approval before introducing it.

### Lazy loading is required

A C++ compiler toolchain can be large.

Therefore:

- Do not load the compiler during normal page initialization.
- Ordinary reading must not pay the compiler download/startup cost.
- Load the runtime on first meaningful interaction, preferably first `Run`.
- Reuse/cache the runtime for subsequent playgrounds where practical.

Conceptually:

```text
page load
→ article and normal code blocks render immediately
→ playground shell remains lightweight
→ user clicks Run
→ compiler/runtime loads
→ compile and execute
```

### Use a Web Worker

Compilation/execution should happen outside the main UI thread where feasible.

Preferred separation:

```text
src/components/playground/
├── CppPlayground.astro
├── CppEditor.ts
├── cpp-worker.ts
└── playground.css
```

The exact filenames/framework integration may change, but preserve the separation between UI and compiler/runtime work.

### Progressive enhancement

Interactive execution must never become a dependency for understanding core course content.

If:

- JavaScript is disabled;
- WebAssembly is unavailable;
- the runtime fails to load;
- compilation crashes;
- the browser is unsupported;

the surrounding teaching article should remain useful.

Important examples should still exist as readable source code.

### Editor scope

The current playground uses CodeMirror 6 behind the site-owned `CppEditor.ts` adapter.
It loads on the first Edit interaction; ordinary reading keeps static Shiki highlighting,
and the compiler still loads only on Run. A plain `<textarea>` remains the fallback if
the editor cannot load. Keep editor features limited to introductory code editing.

Do not introduce Monaco merely because this feature involves code.

Use the adapter to keep MDX content and the compiler independent of CodeMirror.

Features that are explicitly **out of scope for the initial playground**:

- full IDE behavior;
- clangd;
- IntelliSense;
- project/file explorers;
- multi-file projects;
- debugger integration;
- package management;
- arbitrary third-party libraries;
- network access;
- OS emulation.

### Runtime expectations

The playground should target ordinary introductory C++ examples using standard facilities such as:

```text
iostream
string
vector
algorithm
map
set
cmath
std::cin
std::cout
std::cerr
```

Do not promise that browser execution exactly reproduces the students' native Linux/GCC environment.

WASM/WASI limitations should be documented where relevant.

The normal course workflow should still teach real compilation and debugging, for example:

```bash
g++ main.cpp -o main
./main
```

The playground supplements this workflow; it does not replace it.

### Diagnostics

Compiler diagnostics are educational content.

When implemented, distinguish clearly between:

- compiler errors/warnings;
- runtime stderr;
- normal stdout;
- runtime/toolchain failures.

Do not collapse every failure into a generic "Error".

### Security and resource limits

Treat user-edited code as untrusted.

When implementing the playground, consider:

- execution timeouts;
- terminating/restarting the worker;
- memory limits where supported;
- preventing a runaway program from freezing the page;
- browser/runtime limitations.

Do not add server infrastructure merely for sandboxing unless explicitly approved.

---

## 12. C++ Teaching Philosophy for the Site

The interactive playground must not accidentally teach students that C++ normally runs as a browser scripting language.

Students should still learn the real development loop:

```text
write source
→ compile
→ read diagnostics
→ run
→ test
→ debug
→ submit to OJ
```

Use browser execution for quick experimentation and conceptual demonstrations.

For environment/debugging lessons, prefer teaching actual compiler commands and tools.

For OJ work, the OJ remains the authoritative execution/submission environment.

---

## 13. Content Authoring Guidelines

Prefer content that is easy to edit directly in a text editor.

Do not require authors to write Astro components for ordinary lessons.

Use plain Markdown when possible and MDX only when components are genuinely useful.

Code examples should normally be fenced code blocks:

````markdown
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, world!\n";
}
```
````

Only convert an example to `<CppPlayground>` when interaction has clear pedagogical value.

Use math syntax supported by the configured Markdown/KaTeX pipeline.

Keep frontmatter concise. Do not create metadata fields without a concrete use.

---

## 14. Agent Rules

When operating in this repository:

1. Read this file before making architectural changes.
2. Preserve static deployment unless explicitly instructed otherwise.
3. Keep Teaching integrated into the personal homepage.
4. Optimize primarily for student reading and authoring experience.
5. Avoid unnecessary dependencies.
6. Do not introduce a database/backend/CMS for problems solvable statically.
7. Do not introduce a SPA architecture merely for interactivity.
8. Keep ordinary content editable as Markdown/MDX.
9. Do not expose unreleased OJ solutions in generated static output.
10. Be cautious about committing sensitive unreleased course material to a public Git repository.
11. Treat interactive C++ as optional progressive enhancement.
12. Do not implement the full C++ playground unless the task actually concerns it.
13. When implementing the playground, hide the compiler implementation behind a stable site-owned component/API.
14. Re-check the state of relevant C++/WASM tooling at implementation time.
15. Prefer small, reversible changes over large framework rewrites.
16. Run appropriate build/type/lint checks after modifying implementation code.
17. Update this document when a major architectural decision changes.

---

## 15. Definition of a Good First Version

A successful initial version does **not** need every planned feature.

It should allow the owner to:

1. Write a course page in Markdown/MDX.
2. Include LaTeX.
3. Include well-highlighted C++.
4. Categorize/tag content.
5. Publish a semester-specific Teaching section.
6. Publish/hide OJ solutions safely according to release status.
7. Add algorithm notes.
8. Deploy automatically to GitHub Pages.
9. Maintain the site without frequent framework work.

It should also leave a clear, documented path for later adding:

```mdx
<CppPlayground ... />
```

without requiring a redesign of the content system.

That extension point is sufficient for the first version; the compiler itself is not.
