# 🎮 COH3 Overlay – Live Stats for stream

A lightweight and customizable overlay for **Company of Heroes 3**, designed for streamers and content creators.  
It displays your **live stats and match results** from [coh3stats.com](https://coh3stats.com) directly inside **OBS** or **Streamlabs**.

---

## ⚙️ Main Features

- 📊 **Live statistics** fetched directly from *coh3stats.com*  
- 🧮 **Session difference tracking** — see wins/losses since the last “Start”  
- 🧭 **Three display modes** :
  - By match size : `1v1`, `2v2`, `3v3`, `4v4`  
  - By faction : `US`, `British`, `DAK`, `Wehrmacht`  
  - By side : `Allies` / `Axis`  
- 🛠️ **Separate configuration page** (select modes, factions, player ID)  
- 🔁 **Auto‑refresh** every 15 seconds  
- 💾 Local persistence in `/data/session.json` and `/data/player.json`  
- 🧱 Built with **Node.js + Express + ES Modules**  
- 🎥 Fully compatible with **OBS / Streamlabs / XSplit**

---

## 🪜 Quick Setup

### 1️⃣ Clone the project
```git clone https://github.com/<your-username>/coh3-overlay.git
cd coh3-overlay
npm install
```

---

### 2️⃣ Start the local server

```
npm run dev
or
node coh3-server.js
```

Server runs on **[http://localhost:3000](http://localhost:3000)**  
You’ll see in your console:

```
✅ Serveur COH3 en ligne : http://localhost:3000
➡️ Pages :
- Configuration : http://localhost:3000/config.html
- Overlay : http://localhost:3000/overlay.html
```

---

### 3️⃣ Configure your overlay
1. Go to [**http://localhost:3000/config.html**](http://localhost:3000/config.html)
2. Enter your **coh3stats player ID**
3. Click **🚀 Start** to record your current stats snapshot
4. Select the game modes you want (`1v1`, `2v2`, etc.)
5. Choose your **display mode** (size, faction, or team)
6. Preview **overlay.html**
7. In **OBS / Streamlabs**, add a *Browser Source* with:  
```
http://localhost:3000/overlay.html
width: 1920 height: 100 background: transparent
```

---

## 📁 Project Structure

```
coh3-overlay/
│
├─ data/ # local data (ignored by git)
│ ├─ player.json # current coh3stats player ID
│ └─ session.json # last session snapshot
│
├─ public/
│ ├─ config.html # configuration page
│ ├─ overlay.html # overlay view for OBS
│ ├─ css/style.css # shared styles
│ └─ js/
│ ├─ config.js # config page logic
│ ├─ overlay.js # live overlay logic
│ └─ utils.js # shared constants and helpers
│
├─ coh3-server.js # Node.js Express server (local API proxy)
├─ package.json
└─ .gitignore
```

---

## 🧩 Tech Stack

- **Node.js / Express** → lightweight backend & API proxy  
- **Fetch API** → requests to [coh3stats.com](https://coh3stats.com)  
- **JavaScript ES Modules**  
- **HTML5 / CSS3 frontend**  
- **OBS / Streamlabs OBS** for streaming integration

---

## 🪄 Example Display
`1v1: 03/01 2v2: 08/07 3v3: 05/03 4v4: 00/01`

or, if “Faction” mode selected:

`American: 07/02 British: 05/01 DAK: 01/01 German: 04/03`

---

## 🧠 Tips

- You can click **Start** anytime to reset and track a new game session.  
- The backend automatically stores your current player ID in `data/player.json`.  
- Easy to extend — support multiple players by adding IDs or extra routes.

---

## ⚖️ License

This project is released under the **MIT License**.  
Feel free to use, copy, modify, and distribute it as long as this notice remains.

---

## 💬 Author

👤 **DyDum77**

---

⭐ **If this overlay helps your stream, don’t forget to star the repo!**