# Internal asset provenance and usage

Authoritative placement register: `asset-register.json`. Each content image has exactly one page placement. The French homepage uses a separately generated scene; French category and featured-equipment sections use text rather than copies of English imagery. The two original social cards belong only to their respective homepages. No shared photo fallback exists.

Original vector equipment illustrations are authored in `scripts/create-vectors.py` and checked in as SVG. The English homepage featured illustrations and the category-page illustrations are separate compositions, not crops or recolours. The logo/favicon are identity UI. Header and footer branding is CSS typography, not a reused content image.

## Built-in image-generation outputs

Both images were generated with the built-in image tool, visually reviewed, and encoded to WebP at quality 84. They do not assert fleet ownership or completed projects. Provenance remains in this document, not in visitor-facing captions.

### English hero

- Source: `exec-b1a688ce-b4ce-46fc-a470-7e702d5fd8b8.png`
- Project asset: `public/images/home-hero.webp`
- Placement: `/en/` hero only.
- Prompt: Use case: photorealistic-natural. Asset type: wide homepage hero for a premium Canadian commercial rental coordination website. Create a high-end editorial industrial photograph, landscape 3:2. A single unbranded orange compact excavator prominently on the right in a spacious gravel construction staging area, one dark gray mobile generator in middle distance, concrete industrial building and soft treeline behind, early morning overcast cool light with warm highlights, realistic machinery details, quiet orderly atmosphere. Frame equipment on right two-thirds, left third is open darker gravel and subtle building for potential text. No people, no logos, no text, no watermarks, no flags. Natural photographic texture, restrained colors navy gray and safety orange; avoid exaggerated HDR. Do not imply any specific company's fleet or completed project.

### French hero

- Source: `exec-23626bc3-925d-468c-95e9-c81ffe61e478.png`
- Project asset: `public/images/home-hero-fr.webp`
- Placement: `/fr/` hero only.
- Prompt: Use case: photorealistic-natural. Asset type: French homepage hero for a Canadian commercial rental coordination website. Create a unique premium editorial landscape photograph, 3:2. A single unbranded orange telescopic material handler parked in profile at the right side of a clean commercial construction area, forks lowered safely, stacked timber and a modern steel-framed building in background. Foreground concrete loading area extends into open left half. Cool blue overcast morning light, realistic industrial details, understated navy gray and safety orange colors, no workers, no text, no brand logos, no flags, no watermarks. Wide camera viewpoint, compelling photographic composition, realistic texture. This is a generic scene, not a completed company project. Do not include excavators or generators.

## Verification scope

See `asset-audit-prior.json` for the exact accessible-local image count, unreadable files, exact matches and near-duplicate candidates. The comparison covers accessible image files in the local ChatGPT projects directory, excluding dependencies, build output and browser-test output. It does not establish uniqueness against inaccessible remote-only inventories or every site ever built. No such portfolio-wide claim is made. Perceptual hashes detect candidates, not definitive semantic identity; candidates must be visually reviewed.

Final audit: 18 registered assets compared with 1,346 accessible prior images; zero exact matches, zero perceptual near-duplicate candidates, and zero unreadable files. Scope remains limited to accessible local inventories.
