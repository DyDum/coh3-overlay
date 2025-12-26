/*
 * config.js
 * ─────────
 * Gère toute la logique de la page de configuration :
 * - sauvegarde des modes visibles
 * - choix du mode d’affichage
 * - choix du joueur (ID coh3stats)
 * - démarrage d’une session (snapshot de référence)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sélection des éléments HTML ---
  const saveBtn = document.getElementById('save');
  const startBtn = document.getElementById('start');
  const savePlayerBtn = document.getElementById('savePlayer');
  const msg = document.getElementById('msg');
  const playerIdInput = document.getElementById('playerId');
  const displaySelect = document.getElementById('displayMode');

  // --- Chargement des préférences sauvegardées ---
  const visible = JSON.parse(localStorage.getItem('visibleModes') || '["1v1","2v2","3v3","4v4"]');
  document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = visible.includes(cb.value));
  playerIdInput.value = localStorage.getItem('playerId') || '';
  displaySelect.value = localStorage.getItem('displayMode') || 'size';

  // --- Écouteurs de click ---
  saveBtn.onclick = saveConfig;
  startBtn.onclick = startSession;
  savePlayerBtn.onclick = savePlayer;

  /**
   * Sauvegarde les choix de modes + du mode d’affichage dans le localStorage
   */
  function saveConfig() {
    const checked = [...document.querySelectorAll('input[type=checkbox]:checked')].map(el => el.value);
    localStorage.setItem('visibleModes', JSON.stringify(checked));
    localStorage.setItem('displayMode', displaySelect.value);
    showMsg("✅ Configuration enregistrée !");
  }

  /**
   * Appelle l’API locale pour capturer un snapshot de session
   */
  async function startSession() {
    const id = playerIdInput.value.trim();
    if (!id) return showMsg("⚠️ ID requis !");
    try {
      const res = await fetch(`/api/start-session?id=${id}`, { method: 'POST' });
      const data = await res.json();
      showMsg(data.message);
    } catch {
      showMsg("❌ Erreur de session");
    }
  }

  /**
   * Sauvegarde l’ID joueur dans player.json via le serveur
   */
  async function savePlayer() {
    const id = playerIdInput.value.trim();
    if (!id) return showMsg("⚠️ ID requis !");
    try {
      const res = await fetch(`/api/set-player?id=${id}`, { method: 'POST' });
      const data = await res.json();
      localStorage.setItem('playerId', id);
      showMsg(data.message);
    } catch {
      showMsg("❌ Erreur de sauvegarde joueur");
    }
  }

  /**
   * Affiche un petit message temporaire en bas de page (confirmation)
   */
  function showMsg(text) {
    msg.textContent = text;
    msg.style.opacity = 1;
    setTimeout(() => msg.style.opacity = 0, 2500);
  }
});
