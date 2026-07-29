# Icon System Design

## Goal

Remove every emoji used as a visual icon while keeping content data independent
from React and icon-library components.

## Architecture

`ModuleItem` stores a semantic `iconKey`, not a React component or rendered
element. A dedicated UI icon registry maps each supported key to a Lucide
component. Components resolve the key through that registry when rendering.

This keeps:

- content data serializable and independent from React;
- icon-library imports inside the presentation layer;
- supported icon values type-safe;
- future icon changes centralized.

## Lucide Mapping

| Existing emoji | Semantic key | Lucide icon |
| --- | --- | --- |
| 💬 | `one-on-one` | `MessageCircle` |
| 📝 | `workshop` | `NotebookPen` |
| 🏫 | `small-class` | `UsersRound` |
| 🎙️ | `keynote` | `Mic2` |
| 🎯 | Inline target label | `Target` |

## Brand Icon Policy

Social and third-party brand icons such as Instagram, Facebook, YouTube, and
LinkedIn use Font Awesome Brands. The Life Design Lab paper-plane logo remains
the supplied custom SVG because it is the site's own brand asset.

The current UI contains no social or third-party brand icons, so unused Font
Awesome dependencies will not be added until a brand icon is rendered.

## Verification

- A registry behavior test verifies every supported module key resolves to the
  intended Lucide component.
- A repository scan confirms no emoji icon literals remain in application
  source.
- TypeScript and the production build must pass.
