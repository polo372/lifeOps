// // =====================================================
// // TIMER.JS - Gestion du minuteur Pomodoro
// // VERSION AMÉLIORÉE avec tracking des statistiques
// // =====================================================

// import { save, load } from "./storage.js";

// // Variables globales pour le timer
// let duration = 25 * 60; // 25 minutes en secondes (25 * 60 = 1500 secondes)
// let remainingTime = duration; // Temps restant
// let interval = null; // Référence à l'intervalle setInterval

// // Références aux éléments HTML
// let display;
// let startBtn;
// let pauseBtn;
// let resetBtn;

// // =====================================================
// // INITIALISATION du timer
// // =====================================================
// export function initTimer() {
//   // Récupérer les éléments du DOM
//   display = document.getElementById("time-display");
//   startBtn = document.getElementById("start-timer");
//   pauseBtn = document.getElementById("pause-timer");
//   resetBtn = document.getElementById("reset-timer");

//   // Afficher le temps initial
//   updateDisplay();

//   // Attacher les événements aux boutons
//   startBtn.addEventListener("click", start);
//   pauseBtn.addEventListener("click", pause);
//   resetBtn.addEventListener("click", reset);
// }

// // =====================================================
// // FONCTION: Obtenir la clé de date d'aujourd'hui
// // =====================================================
// function getTodayKey() {
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// }

// // =====================================================
// // FONCTION: Incrémenter le compteur de sessions Pomodoro
// // =====================================================
// function incrementPomodoroSession() {
//   const today = getTodayKey();
  
//   // Charger toutes les stats
//   const allStats = load("productivityStats", {});
  
//   // Initialiser si nécessaire
//   if (!allStats[today]) {
//     allStats[today] = {
//       tasksCompleted: 0,
//       pomodoroSessions: 0,
//       totalTasks: 0
//     };
//   }
  
//   // Incrémenter le compteur de sessions
//   allStats[today].pomodoroSessions += 1;
  
//   // Sauvegarder
//   save("productivityStats", allStats);
  
//   console.log(`🍅 Session Pomodoro complétée ! Total: ${allStats[today].pomodoroSessions}`);
// }

// // =====================================================
// // FONCTION: Démarrer le timer
// // =====================================================
// function start() {
//   // Si un timer est déjà actif, ne rien faire
//   if (interval) return;

//   // Créer un intervalle qui s'exécute chaque seconde (1000ms)
//   interval = setInterval(() => {
//     // Si il reste du temps
//     if (remainingTime > 0) {
//       remainingTime--; // Décrémenter d'une seconde
//       updateDisplay(); // Mettre à jour l'affichage
//     } else {
//       // Le temps est écoulé !
//       stop();
      
//       // ✨ NOUVEAU: Incrémenter le compteur de sessions
//       incrementPomodoroSession();
      
//       // Notifier l'utilisateur
//       alert("⏰ Temps écoulé ! Pause bien méritée 😄");
      
//       // Optionnel: Réinitialiser automatiquement pour la prochaine session
//       remainingTime = duration;
//       updateDisplay();
//     }
//   }, 1000); // Exécuter toutes les 1000 millisecondes (1 seconde)
// }

// // =====================================================
// // FONCTION: Mettre en pause le timer
// // =====================================================
// function pause() {
//   stop(); // Arrêter l'intervalle
// }

// // =====================================================
// // FONCTION: Réinitialiser le timer
// // =====================================================
// function reset() {
//   stop(); // Arrêter l'intervalle
//   remainingTime = duration; // Remettre le temps à 25 minutes
//   updateDisplay(); // Mettre à jour l'affichage
// }

// // =====================================================
// // FONCTION: Arrêter l'intervalle
// // =====================================================
// function stop() {
//   // clearInterval arrête l'exécution de l'intervalle
//   clearInterval(interval);
//   interval = null; // Réinitialiser la référence
// }

// // =====================================================
// // FONCTION: Mettre à jour l'affichage du temps
// // =====================================================
// function updateDisplay() {
//   // Calculer les minutes: diviser par 60 et arrondir vers le bas
//   const minutes = Math.floor(remainingTime / 60);
  
//   // Calculer les secondes: reste de la division par 60
//   const seconds = remainingTime % 60;
  
//   // Formater avec des zéros devant si nécessaire
//   // padStart(2, "0") ajoute un 0 devant si le nombre a moins de 2 chiffres
//   // Exemple: 5 devient "05", 12 reste "12"
//   const minutesStr = String(minutes).padStart(2, "0");
//   const secondsStr = String(seconds).padStart(2, "0");
  
//   // Afficher au format MM:SS
//   display.textContent = `${minutesStr}:${secondsStr}`;
// }

import { createActor } from "xstate";
import { timerMachine } from "./timerMachine.js";

const timerService = createActor(timerMachine);

timerService.subscribe((state) => {
  console.log("Current state:", state.value);
});

timerService.start();

startBtn.addEventListener("click", () => {
  timerService.send({ type: "START" });
});

pauseBtn.addEventListener("click", () => {
  timerService.send({ type: "PAUSE" });
});

resetBtn.addEventListener("click", () => {
  timerService.send({ type: "RESET" });
});
