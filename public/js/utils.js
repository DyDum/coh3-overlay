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
  2130255: "American", 2130257: "British", 2130259: "DAK", 2130261: "German",
  2130300: "American", 2130302: "British", 2130304: "DAK", 2130306: "German",
  2130329: "American", 2130331: "British", 2130333: "DAK", 2130335: "German",
  2130353: "American", 2130356: "British", 2130358: "DAK", 2130360: "German"
};

/**
 * formate les nombres (victoires/défaites) sous la forme 02/03
 */
export function fmt(obj) {
  return `${String(Math.max(0,obj.w)).padStart(2,"0")}/${String(Math.max(0,obj.l)).padStart(2,"0")}`;
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
