# Upstream and Dark Ice fork

- Upstream: <https://github.com/AlbertAZ1992/every-qrcode>
- Pinned upstream commit: `fe9fdb76a4b35ad3bdba388e22ca4c863803497b`
- Audit date: 1 September 2026
- Licence: MIT, retained in `LICENSE`
- Dark Ice integration branch: `feat/dark-ice-systems-cube`

## Fork changes

- Adds a deterministic `systems-cube` model to the renderer, React component and Web Component selector.
- Preserves the canonical QR base matrix beneath the 3D upper form.
- Replaces the completed visual morph with the exact black-and-white SVG QR, including its four-module quiet zone.
- Pauses the renderer when it is offscreen or the document is hidden.
- Surfaces GPU device loss through the existing fallback path.
- Adds the Matt Crombie Systems Cube experience under the isolated `/systems-cube/` base path.

The original package namespace must not be used for a registry release of this fork. Upstream updates should be reviewed on a dedicated sync branch and retested before merging.
