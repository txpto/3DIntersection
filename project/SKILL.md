---
name: interseccion-3d-design
description: Use this skill to generate well-branded interfaces and assets for Intersección 3D (a technical Three.js sphere-cube intersection viewer), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick facts to remember:
- Language of the UI is **Spanish**, tone is **technical and declarative**.
- Palette is **deep-space navy** (#02030a / #03040d / #050714), text is **lavender-tinted white** (#d5dcff / #c6d2ff / #9fb0ff).
- Data channels: **cyan #2ac0ff** for the sphere, **magenta #f08cff** for the cube, **mint #7dff7f** for intersection / success.
- Type is **Inter + system-ui** with **JetBrains Mono** for `<code>`. Scale is tight (12 / 14 / 16 / 20 / 28).
- **No box-shadows** on DOM; elevation = translucency + 1px navy border. Glow is reserved for data emission only.
- Numbers: extents `toFixed(3)`, volume `toFixed(4)`, separator ` · `, prefer `Δ` over "delta".
- Never use emoji. Never use gradients as UI surfaces.
