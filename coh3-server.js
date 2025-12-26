/*
 * coh3-server.js
 * ───────────────
 * Serveur Node.js local (Express) servant à :
 *   - héberger les pages overlay et config
 *   - stocker les données locales (fichiers JSON)
 *   - agir en proxy vers l’API coh3stats.com pour éviter les erreurs CORS
 *   - gérer les sessions (pour calculer les victoires & défaites à partir d’un snapshot)
 */

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // import dynamique
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ───── PID ─────
// Fichier PID dans le même dossier que server.js
const pidFile = path.join(__dirname, "server.pid");

try {
  fs.writeFileSync(pidFile, process.pid.toString(), "utf8");
  console.log(`💾 PID enregistré (${process.pid}) dans ${pidFile}`);
} catch (err) {
  console.error("❌ Impossible d'écrire le fichier PID :", err);
}

// Quand le processus se termine, on nettoie le fichier
process.on("exit", () => {
  try {
    if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile);
    console.log("🧹 Fichier PID supprimé proprement");
  } catch (e) {}
});

// ───── Configuration de base ─────
const app = express();
const PORT = 3000;
const playerID = 455809;

// Dossiers et fichiers utilisés
const DATA_DIR = path.join(__dirname, 'data');
const SESSION_FILE = path.join(DATA_DIR, 'session.json');
const PLAYER_FILE = path.join(DATA_DIR, 'player.json');

// ───── Middlewares généraux ─────
app.use(cors());                // autorise toutes origines (plus simple en local)
app.use(express.static('public'));  // sert les fichiers HTML/JS/CSS
app.use(express.json());        // parse automatiquement les corps JSON

// ──────────────────────────────────────────────
//    FONCTIONS UTILITAIRES
// ──────────────────────────────────────────────

/**
 * Lecture de l’ID joueur depuis "data/player.json".
 * Si le fichier n’existe pas, ou l’ID est manquant, retourne "455809" par défaut.
 */
function getPlayerId() {
  if (fs.existsSync(PLAYER_FILE)) {
    const { id } = JSON.parse(fs.readFileSync(PLAYER_FILE, 'utf8'));
    return id || playerID;
  }
  return playerID;
}

// ──────────────────────────────────────────────
//    ROUTE: /api/set-player
// ──────────────────────────────────────────────
/**
 * Sauvegarde un nouvel ID joueur envoyé depuis la page config.
 * Exemple : POST /api/set-player?id=123456
 */
app.post('/api/set-player', (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  
  // Crée le dossier "data" s’il n’existe pas encore
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

  fs.writeFileSync(PLAYER_FILE, JSON.stringify({ id }), 'utf8');
  res.json({ message: `✅ Joueur défini sur ${id}` });
});

// ──────────────────────────────────────────────
//    ROUTE: /api/stats
// ──────────────────────────────────────────────
/**
 * Fait office de proxy vers l’API coh3stats.
 * Permet au front d’éviter les erreurs CORS en appelant simplement /api/stats.
 *   GET /api/stats?id=xxxx
 *   → renvoie toute la réponse JSON de l’API coh3stats pour ce joueur.
 */
app.get('/api/stats', async (req, res) => {
  try {
    const id = req.query.id || getPlayerId();
    const API_URL = `https://coh3-api.reliclink.com/community/leaderboard/getpersonalstat?profile_ids=[${id}]&title=coh3`;

    const response = await fetch(API_URL, {
      //headers: { 'Origin': 'https://coh3stats.com' }  // simulateur d'origine pour éviter blocage CORS
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────
//    ROUTE: /api/start-session
// ──────────────────────────────────────────────
/**
 * Crée un "snapshot" des statistiques actuelles du joueur.
 * Ce snapshot sert de base pour calculer les différences pendant la session.
 *   POST /api/start-session?id=xxxx
 */
app.post('/api/start-session', async (req, res) => {
  const id = req.query.id || getPlayerId();
  const API_URL = `https://coh3-api.reliclink.com/community/leaderboard/getpersonalstat?profile_ids=[${id}]&title=coh3`;

  try {
    // Récupère les stats actuelles du joueur depuis l’API COH3Stats
    const response = await fetch(API_URL, { headers: {  } });
    const data = await response.json();
    
    // Extrait les stats détaillées pour tous les modes
    const snapshot = data.leaderboardStats || [];

    // Sauvegarde dans /data/session.json
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    fs.writeFileSync(SESSION_FILE, JSON.stringify(snapshot, null, 2), 'utf8');

    // Réponse HTTP → confirmation côté config.html
    res.json({ message: `Session démarrée pour ${id} à ${new Date().toLocaleTimeString()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de créer la session' });
  }
});

// ──────────────────────────────────────────────
//    ROUTE: /api/session
// ──────────────────────────────────────────────
/**
 * Fournit le contenu du dernier snapshot si disponible.
 * Ce fichier est lu par overlay.js pour afficher les différences.
 */
app.get('/api/session', (req, res) => {
  if (fs.existsSync(SESSION_FILE)) {
    res.sendFile(SESSION_FILE);
  } else {
    res.status(404).json({ error: 'Aucune session active' });
  }
});

// ──────────────────────────────────────────────
//    DÉMARRAGE DU SERVEUR
// ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Serveur COH3 en ligne : http://localhost:${PORT}`);
  console.log('➡️  Pages disponibles :');
  console.log(`   - Configuration : http://localhost:${PORT}/config.html`);
  console.log(`   - Overlay Streamlabs : http://localhost:${PORT}/overlay.html`);
});
