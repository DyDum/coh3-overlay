/*
 * overlay.js
 * ──────────
 * Gère l’affichage de l’overlay de statistiques COH3.
 * Le script interroge le serveur local (proxy) pour :
 *   - récupérer les statistiques en direct depuis coh3stats.com (API)
 *   - comparer avec un snapshot local (session.json)
 *   - afficher la différence (victoires/défaites) par mode, faction ou camp
 * Rafraîchissement automatique toutes les 15 secondes.
 */

import { modesMap, factionMap, fmt, summarize } from './utils.js';

// URLs locales exposées par ton serveur Node/Express
const API_URL = '/api/stats';
const SESSION_URL = '/api/session';

/**
 * Fonction principale – met à jour le texte affiché sur l’overlay.
 */
async function updateOverlay() {
  try {
    // Récupère les statistiques live + le snapshot (si disponible)
    const [liveRes, snapRes] = await Promise.all([
      fetch(API_URL),
      fetch(SESSION_URL)
    ]);

    const liveData = await liveRes.json();
    const snapData = snapRes.ok ? await snapRes.json() : { all: {} };

    // Convertit les structures API en objets simplifiés
    const now = summarize(liveData.leaderboardStats || []);
    const base = summarize(snapData);

    // Préférences utilisateur sauvegardées par config.html
    const visible = JSON.parse(localStorage.getItem('visibleModes') || '["1v1","2v2","3v3","4v4"]');
    const mode = localStorage.getItem('displayMode') || 'size';

    let line = '';

    // ───────────────────────────────────────────────
    //  MODE "TEAM" : Alliés / Axe par format
    // ───────────────────────────────────────────────
    if (mode === 'team') {
      const camps = {
        '1v1-allies': {w:0, l:0}, '1v1-axis': {w:0, l:0},
        '2v2-allies': {w:0, l:0}, '2v2-axis': {w:0, l:0},
        '3v3-allies': {w:0, l:0}, '3v3-axis': {w:0, l:0},
        '4v4-allies': {w:0, l:0}, '4v4-axis': {w:0, l:0},
      };

      for (const id in now.all) {
        const m = modesMap[id];
        const f = factionMap[id];
        if (!visible.includes(m) || !f) continue; // ne garde que les modes sélectionnés

        const side = ['DAK','German'].includes(f) ? 'axis' : 'allies';
        const key = `${m}-${side}`;

        const n = now.all[id] || { w:0, l:0 };
        const b = base.all[id] || { w:n.w, l:n.l };
        const diffW = Math.max(0, n.w - b.w);
        const diffL = Math.max(0, n.l - b.l);

        if (camps[key]) {
          camps[key].w += diffW;
          camps[key].l += diffL;
        }
      }

      // Filtrer par modes sélectionnés
      line = Object.entries(camps)
        .filter(([k]) => visible.includes(k.split('-')[0]))
        .map(([k,v]) => `${k}:${fmt(v)}`)
        .join('    ');
    }

    // ───────────────────────────────────────────────
    //  MODE "FACTION" : US / British / DAK / German
    // ───────────────────────────────────────────────
    else if (mode === 'faction') {
      const factions = { 'US':{w:0,l:0}, 'UK':{w:0,l:0}, 'DAK':{w:0,l:0}, 'WEHR':{w:0,l:0} };

      for (const id in now.all) {
        const f = factionMap[id];
        const m = modesMap[id];
        if (!visible.includes(m) || !f) continue; // ignore modes non cochés

        const n = now.all[id] || {w:0,l:0};
        const b = base.all[id] || {w:n.w, l:n.l};
        const diffW = Math.max(0, n.w - b.w);
        const diffL = Math.max(0, n.l - b.l);

        factions[f].w += diffW;
        factions[f].l += diffL;
      }

      // Afficher uniquement les factions pertinentes (qui ont bougé)
      const relevant = Object.entries(factions)

      const display = (relevant.length ? relevant : Object.entries(factions));
      line = display.map(([f,v]) => `${f}:${fmt(v)}`).join('  ');
    }

    // ───────────────────────────────────────────────
    //  MODE "SIZE" : 1v1 / 2v2 / 3v3 / 4v4
    // ───────────────────────────────────────────────
    else {
      const totals = { "1v1":{w:0,l:0}, "2v2":{w:0,l:0}, "3v3":{w:0,l:0}, "4v4":{w:0,l:0} };

      for (const id in now.all) {
        const m = modesMap[id];
        if (!visible.includes(m)) continue; // filtre sur sélection

        const n = now.all[id] || {w:0,l:0};
        const b = base.all[id] || {w:n.w, l:n.l};
        totals[m].w += Math.max(0, n.w - b.w);
        totals[m].l += Math.max(0, n.l - b.l);
      }

      // 🔍 n'affiche QUE les modes cochés
      line = Object.entries(totals)
        .filter(([mode]) => visible.includes(mode))
        .map(([m,v]) => `${m}:${fmt(v)}`)
        .join('  ');
    }

    // ───────────────────────────────────────────────
    //  Affichage final dans l’overlay
    // ───────────────────────────────────────────────
    document.getElementById('statsLine').textContent = line || 'Session en attente...';
  }

  // Gestion des erreurs API ou JSON
  catch (e) {
    console.error('Erreur overlay:', e);
    //document.getElementById('statsLine').textContent = 'Erreur API';
  }
}

// Premier rafraîchissement immédiat
updateOverlay();

// Rafraîchissement automatique toutes les 15 s
setInterval(updateOverlay, 15000);
