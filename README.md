# AVA + MemorX investor presentations

Two separate, interactive six-minute presentations by Gebsill International Private Limited.

## Open

* AVA: `/?product=ava`
* MemorX: `/?product=memorx`

Use the on-screen controls or left/right arrow keys to navigate. The settings menu selects the product, evidence links and fullscreen mode. The AVA conversation introduces the experience with a demo sample. The MemorX room loads a photographic 3D export and can be explored in the browser. Video playback is user initiated.

## Local preview

Run `python3 -m http.server 8773 --directory public`, then open `http://localhost:8773/`. Serve over HTTP rather than opening an HTML file directly so the 3D asset can load.

## Deployment

Import this GitHub repository into Vercel. Framework: Other. The checked-in `vercel.json` serves `public` without a build or installation command. No environment variables, account or database are required for the presentation. The repository includes substantial film and 3D assets; each file is below GitHub's 100 MB limit. Git integration is the recommended deployment route.

## Editing

Presentation content: `public/content.js`. Layout and behavior: `public/styles.css` and `public/app.js`. Supplied videos and optional working-product URLs: `public/config.js`. Empty product URLs mean a hosted MVP link has not been configured; the presentation is not a hosted version of either product.

The browser-ready room bundle is checked in as `public/room.js`. To rebuild it after editing `src/room.js`, run `npm install` followed by `npm run rebuild:room`. Dependency versions are pinned in `package.json`.

## Credits and rights

The classroom source photographs are from HEIG-VD Geomatics (2026), licensed under CC BY 4.0, reconstructed and refined by MemorX. Original source, attribution and rendering provenance are included under `public/vendor/`. The reconstruction includes inferred appearance and estimated scale.

Source: https://huggingface.co/datasets/heig-vd-geo/scop-datasets

License: https://creativecommons.org/licenses/by/4.0/

Three.js and Spark license texts are retained under `public/vendor/`. Figtree and Playfair Display font license texts are retained under `public/assets/`. Gebsill branding, product materials and supplied films remain the property of their respective owners. This repository does not grant a general license to those materials.

The private presenter guide, internal budget working papers, investor records and inbox data are intentionally not published in this repository.
