# Favicon Replacement

## Scope

Replace only the browser favicon with the user-provided paper-plane SVG.
Keep the header text and all other images unchanged.

## Design

- Copy `/Users/anthonysung/Downloads/logo.svg` to `app/icon.svg` without
  changing its SVG content.
- Remove the existing `app/favicon.ico` so Next.js emits a single favicon
  source instead of duplicate icon metadata.
- Use Next.js App Router file conventions rather than adding manual metadata
  configuration.

## Verification

- Confirm `app/icon.svg` is byte-for-byte identical to the supplied SVG.
- Confirm `app/favicon.ico` no longer exists.
- Run lint and the production build.
- Verify the generated application metadata references the SVG favicon.
