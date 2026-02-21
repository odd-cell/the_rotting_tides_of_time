# The Rotting Tides of Time — Gamesite

A whimsical dark fantasy choose-your-own-adventure game. Play as **Grimshaw** (and **Suki**) through the Fork in the Fallen Forest to the Convergence and beyond.

## Token assets

Place character token images in this folder so the party tracker can display them:

**Folder:** `assets/tokens/`

| Character  | Reference filename (use exactly) |
|------------|-----------------------------------|
| Grimshaw   | `grimshaw.png`                    |
| Suki       | `suki.png`                        |
| Kaelen     | `kaelen.png`                      |
| Malagant   | `malagant.png`                   |
| Snap       | `snap.png`                       |
| Skewer     | `skewer.png`                     |

- **Format:** PNG (or JPG) recommended; any size, but roughly square works best (e.g. 64×64 or 128×128).
- If a file is missing, the tracker will show the character’s initial instead of an image.
- **Grimshaw** and **Suki** are always in the party; the others can be present or absent depending on the path and outcomes.

## Upload to GitHub

1. Create a new repository (e.g. `rotting-tides-game`).
2. Push the contents of the `gamesite` folder to the repo (e.g. put `index.html` and the rest at the root, or in a `docs/` folder and enable GitHub Pages from `docs/`).
3. If using GitHub Pages, the site will be at `https://<username>.github.io/<repo>/` (or with a custom domain).

## Tech

- **HTML** and **CSS** for structure and styling.
- A small amount of **vanilla JavaScript** is used for game state, navigation, progress, and theme switching (no frameworks).

## Color schemes

- **Start:** Black, white, red, gold.
- **Rite of the Pack path:** Pastel dark grey, off-white, pastel magenta, pastel green.
- **Echoes of the Bards path:** Black, silver, gold, royal blue.
