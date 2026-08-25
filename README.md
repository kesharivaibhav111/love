# ❤️ Romantic 3D Interactive Love Website for Sakshi

A romantic, cinematic, 3D interactive digital love letter and apology experience dedicated to **Sakshi**.

---

## ✨ Features Included

1. **3D Glowing Floating Heart (Hero Section)**:
   - Built using Three.js with custom parametric 3D heart geometry.
   - Crystal/ruby physical material with subsurface-like light transmission, rotating rings, and heartbeat pulsing.
   - Orbiting stardust embers reacting to mouse movement and touch.

2. **💌 Heartfelt Sorry Letter**:
   - Emotional letter with glowing borders and glassmorphism styling.
   - Smooth line-by-line staggered text reveals on scroll.

3. **🫶 Interactive "Can You Forgive Me? 🥺❤️" Moment**:
   - 3D interactive button with dynamic hover pulse.
   - On click: triggers a 3D Heart eruption in WebGL + multi-color confetti hearts + warm screen glow.
   - Smoothly reveals the *"Thank You, Sakshi ❤️"* promise.

4. **🌸 "Little Things I Love About You" (Memory Cards)**:
   - 3D parallax tilt on mouse hover with dynamic light reflection.
   - Heartwarming notes celebrating Sakshi's smile, eyes, cute habits, and authentic self.

5. **💖 "Our Little Universe" 3D Scene**:
   - Dedicated WebGL canvas with two 3D hearts (*Sakshi & Me*) in mutual Keplerian orbit.
   - Constellation laser energy line connecting them, surrounded by stardust rings and a cosmic core.

6. **💗 Cinematic Final Closing**:
   - Staggered emotional text reveal.
   - Signature displaying `Always yours — [MY NAME]`.

7. **🎵 Ambient Background Music Player**:
   - Floating romantic audio pill button.
   - Equipped with Web Audio API procedural acoustic fallback so gentle romantic melodies play even if external audio files are blocked or offline.

---

## 🛠️ How to Customize

All texts, names, memories, and music are defined in [`config.js`](file:///Users/vaibhavkeshari/Desktop/love/config.js):

- **Change Your Name**: Open `config.js` and edit `yourName: "YourName"`.
- **Change Music**: Replace `music.url` in `config.js` with any direct MP3 audio URL or local audio file.
- **Edit Message / Memories**: Adjust `letter.paragraphs` or `memories` array in `config.js`.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any modern browser, or run a local HTTP server:

```bash
# Python 3
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.
