// =====================================================
// STATS.JS - Gestion des statistiques de productivité
// =====================================================

// Importation des fonctions de stockage depuis storage.js
import { save, load } from "./storage.js";

// =====================================================
// STRUCTURE DE DONNÉES DES STATISTIQUES
// =====================================================
// Nous stockons les stats dans localStorage avec cette structure :
// {
//   "2024-02-09": {
//     tasksCompleted: 5,      // Nombre de tâches terminées
//     pomodoroSessions: 3,    // Nombre de sessions focus
//     totalTasks: 8           // Nombre total de tâches créées
//   },
//   "2024-02-08": { ... }
// }

// =====================================================
// FONCTION: Obtenir la date du jour au format YYYY-MM-DD
// =====================================================
function getTodayKey() {
  const today = new Date();
  // toISOString() retourne "2024-02-09T10:30:00.000Z"
  // split('T')[0] prend seulement la partie avant le T, donc "2024-02-09"
  return today.toISOString().split('T')[0];
}

// =====================================================
// FONCTION: Récupérer les statistiques d'une date spécifique
// =====================================================
function getStatsForDate(dateKey) {
  // Charger toutes les stats depuis localStorage
  const allStats = load("productivityStats", {});
  
  // Si la date n'existe pas encore, retourner un objet par défaut
  if (!allStats[dateKey]) {
    return {
      tasksCompleted: 0,
      pomodoroSessions: 0,
      totalTasks: 0
    };
  }
  
  // Sinon retourner les stats existantes
  return allStats[dateKey];
}

// =====================================================
// FONCTION: Sauvegarder les statistiques pour une date
// =====================================================
function saveStatsForDate(dateKey, stats) {
  // Charger toutes les stats existantes
  const allStats = load("productivityStats", {});
  
  // Mettre à jour la date spécifique
  allStats[dateKey] = stats;
  
  // Sauvegarder dans localStorage
  save("productivityStats", allStats);
}

// =====================================================
// FONCTION: Incrémenter une statistique (ex: +1 tâche)
// =====================================================
function incrementStat(statName) {
  const today = getTodayKey();
  const todayStats = getStatsForDate(today);
  
  // Incrémenter le compteur spécifique
  todayStats[statName] = (todayStats[statName] || 0) + 1;
  
  // Sauvegarder
  saveStatsForDate(today, todayStats);
}

// =====================================================
// AFFICHAGE: Mettre à jour tous les compteurs visuels
// =====================================================
function updateTodayDisplay() {
  const today = getTodayKey();
  const stats = getStatsForDate(today);
  
  // Récupérer les éléments HTML
  const tasksElement = document.getElementById("tasks-completed-today");
  const pomodoroElement = document.getElementById("pomodoro-sessions-today");
  const focusTimeElement = document.getElementById("focus-time-today");
  const completionElement = document.getElementById("completion-rate");
  
  // Mettre à jour les valeurs
  if (tasksElement) {
    tasksElement.textContent = stats.tasksCompleted || 0;
  }
  
  if (pomodoroElement) {
    pomodoroElement.textContent = stats.pomodoroSessions || 0;
  }
  
  if (focusTimeElement) {
    // Calcul du temps total: 1 pomodoro = 25 minutes
    const totalMinutes = (stats.pomodoroSessions || 0) * 25;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // Affichage formaté: "2h 30min" ou "45min"
    if (hours > 0) {
      focusTimeElement.textContent = `${hours}h ${minutes}min`;
    } else {
      focusTimeElement.textContent = `${minutes}min`;
    }
  }
  
  if (completionElement) {
    // Calcul du taux de complétion
    // Éviter la division par zéro
    if (stats.totalTasks > 0) {
      const rate = Math.round((stats.tasksCompleted / stats.totalTasks) * 100);
      completionElement.textContent = `${rate}%`;
    } else {
      completionElement.textContent = "0%";
    }
  }
}

// =====================================================
// AFFICHAGE: Date actuelle en français
// =====================================================
function displayCurrentDate() {
  const dateElement = document.getElementById("current-date");
  if (!dateElement) return;
  
  const today = new Date();
  
  // Formater la date en français
  const formatted = today.toLocaleDateString("fr-FR", {
    weekday: "long",     // "lundi"
    day: "numeric",      // "9"
    month: "long",       // "février"
    year: "numeric"      // "2024"
  });
  
  dateElement.textContent = formatted;
}

// =====================================================
// GRAPHIQUE: Générer les données des 7 derniers jours
// =====================================================
function getLast7DaysData() {
  const data = [];
  const today = new Date();
  
  // Boucle pour les 7 derniers jours
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    // Soustraire i jours à la date actuelle
    date.setDate(date.getDate() - i);
    
    // Obtenir la clé de date (YYYY-MM-DD)
    const dateKey = date.toISOString().split('T')[0];
    
    // Obtenir le nom du jour (Lun, Mar, Mer...)
    const dayName = date.toLocaleDateString("fr-FR", { weekday: "short" });
    
    // Récupérer les stats de ce jour
    const stats = getStatsForDate(dateKey);
    
    // Ajouter au tableau de données
    data.push({
      day: dayName,
      date: dateKey,
      tasks: stats.tasksCompleted || 0,
      sessions: stats.pomodoroSessions || 0
    });
  }
  
  return data;
}

// =====================================================
// GRAPHIQUE: Créer le graphique en barres
// =====================================================
function createWeeklyChart() {
  const chartContainer = document.getElementById("weekly-chart");
  if (!chartContainer) return;
  
  // Vider le contenu précédent
  chartContainer.innerHTML = "";
  
  const weekData = getLast7DaysData();
  
  // Trouver la valeur maximale pour la hauteur relative
  const maxTasks = Math.max(...weekData.map(d => d.tasks), 1);
  
  // Créer une barre pour chaque jour
  weekData.forEach(day => {
    // Créer l'élément conteneur de la barre
    const barColumn = document.createElement("div");
    barColumn.className = "chart-bar";
    
    // Créer la barre elle-même
    const bar = document.createElement("div");
    bar.className = "bar";
    
    // Calculer la hauteur en pourcentage (max = 100%)
    const heightPercent = (day.tasks / maxTasks) * 100;
    bar.style.height = `${heightPercent}%`;
    
    // Créer l'élément de valeur (nombre au-dessus de la barre)
    const value = document.createElement("div");
    value.className = "bar-value";
    value.textContent = day.tasks;
    
    // Ajouter la valeur dans la barre
    bar.appendChild(value);
    
    // Créer le label du jour
    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = day.day;
    
    // Assembler les éléments
    barColumn.appendChild(bar);
    barColumn.appendChild(label);
    chartContainer.appendChild(barColumn);
  });
}

// =====================================================
// RÉSUMÉ: Calculer les totaux de la semaine
// =====================================================
function updateWeeklySummary() {
  const weekData = getLast7DaysData();
  
  // Calculer les totaux
  let totalTasks = 0;
  let totalSessions = 0;
  let bestDay = null;
  let maxTasks = 0;
  
  weekData.forEach(day => {
    totalTasks += day.tasks;
    totalSessions += day.sessions;
    
    // Trouver le meilleur jour
    if (day.tasks > maxTasks) {
      maxTasks = day.tasks;
      bestDay = day.day;
    }
  });
  
  // Mettre à jour l'affichage
  const totalTasksEl = document.getElementById("week-total-tasks");
  const totalSessionsEl = document.getElementById("week-total-sessions");
  const bestDayEl = document.getElementById("week-best-day");
  
  if (totalTasksEl) totalTasksEl.textContent = totalTasks;
  if (totalSessionsEl) totalSessionsEl.textContent = totalSessions;
  if (bestDayEl) bestDayEl.textContent = bestDay || "-";
}

// =====================================================
// BADGES: Système d'accomplissements
// =====================================================
const BADGES = [
  {
    id: "first-task",
    icon: "🎯",
    title: "Première tâche",
    description: "Complétez votre première tâche",
    condition: (stats) => stats.tasksCompleted >= 1
  },
  {
    id: "productive-day",
    icon: "🔥",
    title: "Journée productive",
    description: "Complétez 5 tâches en un jour",
    condition: (stats) => stats.tasksCompleted >= 5
  },
  {
    id: "focus-master",
    icon: "🧠",
    title: "Maître du focus",
    description: "Complétez 3 sessions Pomodoro",
    condition: (stats) => stats.pomodoroSessions >= 3
  },
  {
    id: "perfect-score",
    icon: "💯",
    title: "Score parfait",
    description: "100% de tâches complétées",
    condition: (stats) => stats.totalTasks > 0 && stats.tasksCompleted === stats.totalTasks
  },
  {
    id: "week-warrior",
    icon: "⚡",
    title: "Guerrier de la semaine",
    description: "Complétez 20 tâches en une semaine",
    condition: () => {
      const weekData = getLast7DaysData();
      const total = weekData.reduce((sum, day) => sum + day.tasks, 0);
      return total >= 20;
    }
  },
  {
    id: "consistency-king",
    icon: "👑",
    title: "Roi de la régularité",
    description: "Travaillez 7 jours de suite",
    condition: () => {
      const weekData = getLast7DaysData();
      return weekData.every(day => day.tasks > 0);
    }
  }
];

// =====================================================
// BADGES: Afficher tous les badges
// =====================================================
function displayBadges() {
  const container = document.getElementById("badges-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const todayStats = getStatsForDate(getTodayKey());
  
  BADGES.forEach(badge => {
    // Vérifier si le badge est débloqué
    const isUnlocked = badge.condition(todayStats);
    
    // Créer l'élément du badge
    const badgeEl = document.createElement("div");
    badgeEl.className = `badge ${isUnlocked ? "unlocked" : "locked"}`;
    
    badgeEl.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-info">
        <div class="badge-title">${badge.title}</div>
        <div class="badge-description">${badge.description}</div>
      </div>
    `;
    
    container.appendChild(badgeEl);
  });
}

// =====================================================
// ACTIONS: Boutons d'action rapide
// =====================================================
function initActions() {
  // Bouton: Réinitialiser aujourd'hui
  const resetBtn = document.getElementById("reset-today");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // Demander confirmation
      if (confirm("Voulez-vous vraiment réinitialiser les statistiques d'aujourd'hui ?")) {
        const today = getTodayKey();
        saveStatsForDate(today, {
          tasksCompleted: 0,
          pomodoroSessions: 0,
          totalTasks: 0
        });
        
        // Rafraîchir l'affichage
        refreshAllDisplays();
        alert("✅ Statistiques réinitialisées !");
      }
    });
  }
  
  // Bouton: Exporter les données
  const exportBtn = document.getElementById("export-stats");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const allStats = load("productivityStats", {});
      
      // Convertir en JSON formaté
      const json = JSON.stringify(allStats, null, 2);
      
      // Créer un fichier téléchargeable
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stats-productivite-${getTodayKey()}.json`;
      a.click();
      
      alert("💾 Données exportées !");
    });
  }
  
  // Bouton: Tout effacer
  const clearBtn = document.getElementById("clear-all-stats");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("⚠️ ATTENTION ! Cela supprimera TOUTES vos statistiques. Continuer ?")) {
        if (confirm("Êtes-vous vraiment sûr ? Cette action est irréversible.")) {
          save("productivityStats", {});
          refreshAllDisplays();
          alert("🗑️ Toutes les statistiques ont été effacées.");
        }
      }
    });
  }
}

// =====================================================
// THÈME: Gestion du mode sombre/clair
// =====================================================
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;
  
  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  } else {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
  
  // Basculer le thème au clic
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}

// =====================================================
// FONCTION: Rafraîchir tous les affichages
// =====================================================
function refreshAllDisplays() {
  displayCurrentDate();
  updateTodayDisplay();
  createWeeklyChart();
  updateWeeklySummary();
  displayBadges();
}

// =====================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("📊 Page de statistiques chargée !");
  
  // Initialiser tous les éléments
  initTheme();
  initActions();
  refreshAllDisplays();
});

// =====================================================
// EXPORTS: Fonctions utilisables depuis d'autres fichiers
// =====================================================
export { incrementStat, refreshAllDisplays };