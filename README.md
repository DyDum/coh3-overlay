# 🎮 COH3 Overlay – Live Stats pour twitch

Un overlay dynamique et personnalisable pour **Company of Heroes 3**, conçu pour les streamers et commentateurs.  
Il affiche en **temps réel** vos statistiques, parties et performances depuis [coh3stats.com](https://coh3stats.com) directement dans **OBS** ou **Streamlabs**.

---

## ⚙️ Fonctionnalités principales

- 📊 **Statistiques en direct** depuis l’API officielle *coh3stats.com*  
- 🧮 **Différences de session** : compte vos victoires/défaites depuis le clic “Start”  
- 🧭 **3 modes d’affichage** :
  - Par format de partie : `1v1`, `2v2`, `3v3`, `4v4`
  - Par faction : `US`, `British`, `DAK`, `Wehrmacht`
  - Par camp : `Alliés` / `Axe`
- 🛠️ **Page de configuration** dédiée (sélection des modes, faction, joueur)  
- 🔁 **Rafraîchissement automatique** toutes les 15 secondes  
- 💾 Sauvegarde locale dans `/data/session.json` et `/data/player.json`  
- 🧱 Basé sur **Node.js + Express + JS Modules (ESM)**  
- 🎥 Compatible **OBS / Streamlabs / XSplit**

---

## 🪜 Installation rapide

### 1️⃣ Clonage du projet

```
git clone https://github.com/<ton-user>/coh3-overlay.git
cd coh3-overlay
npm install
```

---

### 2️⃣ Lancement du serveur

```
npm run dev
OU
node coh3-server.js
```

Le serveur démarre sur **[http://localhost:3000](http://localhost:3000)**  
👀 tu verras dans le terminal :
```
✅ Serveur COH3 en ligne : http://localhost:3000
➡️ Pages :
- Configuration : http://localhost:3000/config.html
- Overlay : http://localhost:3000/overlay.html
```

---

### 3️⃣ Configuration de l’overlay

1. Ouvre [**http://localhost:3000/config.html**](http://localhost:3000/config.html)
2. Saisis ton **ID joueur coh3stats**
3. Clique sur **🚀 Start** pour créer un snapshot  
4. Coche les modes que tu veux suivre (`1v1`, `2v2`, etc.)
5. Choisis ton **type d’affichage**
6. Ouvre **overlay.html** dans ton navigateur pour tester  
7. Dans **OBS / Streamlabs**, ajoute une *source navigateur* avec :
```
http://localhost:3000/overlay.html

largeur: 1920, hauteur: 100, fond: transparent
```

---

## 📁 Structure du projet
```
coh3-overlay/
│
├─ data/ # fichiers temporaires (non suivis par git)
│ ├─ player.json # ID coh3stats actuel
│ └─ session.json # snapshot de session en cours
│
├─ public/
│ ├─ config.html # page de configuration
│ ├─ overlay.html # page affichée dans OBS
│ ├─ css/style.css # style commun
│ └─ js/
│ ├─ config.js # logique de configuration
│ ├─ overlay.js # affichage dynamique
│ └─ utils.js # fonctions partagées
│
├─ coh3-server.js # serveur Node.js / proxy vers coh3stats API
├─ package.json
└─ .gitignore
```

---

## 🧩 Technologies utilisées

- **Node.js** / **Express** → serveur & proxy API  
- **Fetch API** → communications avec coh3stats  
- **JavaScript ES Modules (type : module)**  
- **HTML5 / CSS3**  
- **OBS / Streamlabs** → rendu overlay  

---

## 🪄 Exemple d’affichage

```1v1: 03/01 2v2: 08/07 3v3: 05/03 4v4: 00/01```

ou selon la vue “Faction” :

```American: 07/02 British: 05/01 Durch: 01/01 German: 04/03```


---

## 🧠 Astuces

- Tu peux relancer une session quand tu veux avec **Start** (ça remet à zéro les compteurs).
- Le backend garde l’ID joueur dans `data/player.json`, tu peux le changer à tout moment via la page config.
- Si tu veux suivre plusieurs joueurs, duplique `player.json` et modifie la route du serveur.

---

## ⚖️ Licence

Ce projet est distribué sous licence **MIT**.  
Tu peux l’utiliser, le modifier et le redistribuer librement à condition de conserver la notice de copyright.

---

## 💬 Auteurs

👤 **DyDyum77**
---

### 🌟 N’hésite pas à ajouter une ⭐ sur GitHub si ce projet t’a aidé !