/*
 * utils.js
 * ────────
 * Contient toutes les constantes et fonctions partagées entre overlay et config.
 * Sert de base unique pour centraliser les mappings et calculs communs.
 */

// 🎯 Correspondance des leaderboard_id → mode de jeu
export const modesMap = {
  2130255: "1v1", 2130257: "1v1", 2130259: "1v1", 2130261: "1v1",
  2130300: "2v2", 2130302: "2v2", 2130304: "2v2", 2130306: "2v2",
  2130329: "3v3", 2130331: "3v3", 2130333: "3v3", 2130335: "3v3",
  2130353: "4v4", 2130356: "4v4", 2130358: "4v4", 2130360: "4v4"
};

// 🎯 Correspondance leaderboard_id → faction
export const factionMap = {
  2130255: "US", 2130257: "UK", 2130259: "DAK", 2130261: "WEHR",
  2130300: "US", 2130302: "UK", 2130304: "DAK", 2130306: "WEHR",
  2130329: "US", 2130331: "UK", 2130333: "DAK", 2130335: "WEHR",
  2130353: "US", 2130356: "UK", 2130358: "DAK", 2130360: "WEHR"
};

/**
 * formate les nombres (victoires/défaites) sous la forme 02/03
 */
export function fmt(obj) {
  return `${String(Math.max(0,obj.w)).padStart(1,"0")}W/${String(Math.max(0,obj.l)).padStart(1,"0")}L`;
}

/**
 * Convertit les statistiques retournées par l’API en structure uniforme.
 * stocke { leaderboard_id: { w:x, l:y } } pour simplifier les comparaisons.
 */
export function summarize(stats) {
  const result = { all: {} };
  for (const s of (stats || [])) {
    if (s?.leaderboard_id) {
      result.all[s.leaderboard_id] = { w: s.wins || 0, l: s.losses || 0 };
    }
  }
  return result;
}
