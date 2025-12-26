/*
 * overlay.js
 * ──────────
 * Sert à récupérer périodiquement les statistiques via ton serveur local
 * et à afficher la différence avec la snapshot (session.json).
 * 
 * Rafraîchit toutes les 15 secondes.
 */

import { modesMap, factionMap, fmt, summarize } from './utils.js';

const API_URL = '/api/stats';
const SESSION_URL = '/api/session';

/**
 * Fonction principale exécutée à chaque refresh
 */
async function updateOverlay() {
  try {
    // Récupère les stats live + la session de référence
    const [liveRes, snapRes] = await Promise.all([
      fetch(API_URL),
      fetch(SESSION_URL)
    ]);

    const liveData = await liveRes.json();
    const snapData = snapRes.ok ? await snapRes.json() : { all: {} };

    // Conversion des deux structures en objets homogènes
    const now = summarize(liveData.RelicProfile?.leaderboardStats || []);
    const base = summarize(snapData);

    // Récupère les préférences d’affichage
    const visible = JSON.parse(localStorage.getItem('visibleModes') || '["1v1","2v2","3v3","4v4"]');
    const mode = localStorage.getItem('displayMode') || 'size';

    let line = '';

    /**
     * MODE "FACTION"
     * Agrège les victoires/défaites par faction (US, British, DAK, Wehr)
     * en filtrant les modes qui ne sont pas cochés dans ta config.
     */
    if (mode === "faction") {
      const factions = { 'American': {w:0,l:0}, 'British': {w:0,l:0}, 'DAK': {w:0,l:0}, 'German': {w:0,l:0} };
      for (const id in now.all) {
        const f = factionMap[id], m = modesMap[id];
        if (!visible.includes(m)) continue; // ignore les modes non sélectionnés
        const curr = now.all[id] || {w:0,l:0};
        const baseStats = base.all[id] || {w:curr.w, l:curr.l}; // fallback si pas de snapshot
        factions[f].w += Math.max(0, curr.w - baseStats.w);
        factions[f].l += Math.max(0, curr.l - baseStats.l);
      }
      line = Object.entries(factions).map(([f,v]) => `${f}: ${fmt(v)}`).join("    ");
    }

    /**
     * MODE "SIZE"
     * Agrège les victoires/défaites par format de partie (1v1, 2v2, etc.)
     */
    else {
      const totals = { "1v1":{w:0,l:0}, "2v2":{w:0,l:0}, "3v3":{w:0,l:0}, "4v4":{w:0,l:0} };
      for (const id in now.all) {
        const m = modesMap[id];
        if (!visible.includes(m)) continue;
        const n = now.all[id] || {w:0,l:0};
        const b = base.all[id] || {w:n.w, l:n.l};
        totals[m].w += Math.max(0, n.w - b.w);
        totals[m].l += Math.max(0, n.l - b.l);
      }
      line = Object.entries(totals).map(([m,v]) => `${m}: ${fmt(v)}`).join("    ");
    }

    // Mise à jour de l’affichage visible sur Streamlabs
    document.getElementById("statsLine").textContent = line || "Session en attente...";
  } 
  catch (e) {
    console.error("Erreur overlay:", e);
    document.getElementById("statsLine").textContent = "Erreur API";
  }
}

// Premier appel + rafraîchissement toutes les 15s
updateOverlay();
setInterval(updateOverlay, 15000);
