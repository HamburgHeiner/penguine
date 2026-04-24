# Penguin Slide

Penguin Slide is a browser-based endless runner where a penguin auto-slides across ice, jumps over obstacles, and collects fish for points.

## Play Locally

1. Open this folder in any static web server.
2. Serve `index.html`.
3. Open the served URL in your browser.

If you already have Python installed, this is one quick option:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Controls

- Jump: `Space`
- Jump: mouse click / tap
- Jump: on-screen `JUMP` button (mobile/touch)

## Features in v1

- Start, Gameplay, and Game Over screens
- Endless runner loop with increasing speed/difficulty
- Two obstacle types: Polar Bear and Snowball
- Fish collectibles with score pop feedback
- Score and high-score tracking (saved in local browser storage)
- Responsive canvas scaling for desktop/mobile
- Audio toggle with safe sound hooks for future asset drop-in
