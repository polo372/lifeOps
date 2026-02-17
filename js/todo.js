// =====================================================
// TODO.JS - Gestion de la liste de tâches
// VERSION AMÉLIORÉE avec tracking des statistiques
// =====================================================

import { save, load } from "./storage.js";

// Variables globales pour stocker les tâches et le filtre actif
let todos = load("todos", []);
let currentFilter = "all";

// Références aux éléments HTML
let todoInput;
let addTodoButton;
let todoContainer;
let filterButtons;

// =====================================================
// INITIALISATION de la liste de tâches
// =====================================================
export function initTodo() {
  // Récupérer les éléments du DOM
  todoInput = document.getElementById("new-todo");
  addTodoButton = document.getElementById("add-todo");
  todoContainer = document.getElementById("todo");
  filterButtons = document.querySelectorAll("#filters button");

  // Ajouter une tâche au clic sur le bouton
  addTodoButton.addEventListener("click", addTodo);
  
  // Ajouter une tâche en appuyant sur Entrée
  todoInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTodo();
  });

  // Gestion des filtres (Toutes / À faire / Faites)
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      // Retirer la classe "active" de tous les boutons
      filterButtons.forEach(b => b.classList.remove("active"));
      // Ajouter la classe "active" au bouton cliqué
      button.classList.add("active");
      renderTodos();
    });
  });

  // Afficher les tâches existantes
  renderTodos();
}

// =====================================================
// FONCTION: Obtenir la clé de date d'aujourd'hui
// =====================================================
function getTodayKey() {
  const today = new Date();
  // Format YYYY-MM-DD pour identifier le jour
  return today.toISOString().split('T')[0];
}

// =====================================================
// FONCTION: Mettre à jour les statistiques du jour
// =====================================================
function updateDailyStats() {
  const today = getTodayKey();
  
  // Charger toutes les stats depuis localStorage
  const allStats = load("productivityStats", {});
  
  // Obtenir les stats d'aujourd'hui (ou créer un objet vide)
  if (!allStats[today]) {
    allStats[today] = {
      tasksCompleted: 0,
      pomodoroSessions: 0,
      totalTasks: 0
    };
  }
  
  // Compter le nombre total de tâches et de tâches complétées
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.done).length;
  
  // Mettre à jour les statistiques
  allStats[today].totalTasks = totalTasks;
  allStats[today].tasksCompleted = completedTasks;
  
  // Sauvegarder dans localStorage
  save("productivityStats", allStats);
  
  console.log(`📊 Stats mises à jour: ${completedTasks}/${totalTasks} tâches`);
}

// =====================================================
// FONCTION: Ajouter une nouvelle tâche
// =====================================================
function addTodo() {
  // Récupérer le texte saisi et enlever les espaces
  const text = todoInput.value.trim();
  
  // Ne rien faire si le champ est vide
  if (!text) return;

  // Ajouter la nouvelle tâche au tableau
  todos.push({ 
    text: text,      // Le texte de la tâche
    done: false      // Non complétée par défaut
  });
  
  // Sauvegarder dans localStorage
  save("todos", todos);
  
  // Vider le champ de saisie
  todoInput.value = "";
  
  // ✨ NOUVEAU: Mettre à jour les statistiques
  updateDailyStats();
  
  // Ré-afficher la liste
  renderTodos();
}

// =====================================================
// FONCTION: Afficher les tâches
// =====================================================
function renderTodos() {
  // Supprimer tous les éléments affichés précédemment
  todoContainer.querySelectorAll(".todo-item").forEach(el => el.remove());

  // Filtrer les tâches selon le filtre actif
  let filtered = todos;
  if (currentFilter === "todofilter") {
    // Afficher seulement les tâches non terminées
    filtered = todos.filter(t => !t.done);
  }
  if (currentFilter === "done") {
    // Afficher seulement les tâches terminées
    filtered = todos.filter(t => t.done);
  }

  // Créer un élément HTML pour chaque tâche
  filtered.forEach(todo => {
    // Créer le conteneur principal
    const div = document.createElement("div");
    div.className = "todo-item";

    // Créer la case à cocher
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done; // Coché si la tâche est terminée

    // Gérer le changement d'état (coché/décoché)
    checkbox.addEventListener("change", () => {
      // Inverser l'état de la tâche
      todo.done = checkbox.checked;
      
      // Sauvegarder
      save("todos", todos);
      
      // ✨ NOUVEAU: Mettre à jour les stats quand on coche/décoche
      updateDailyStats();
      
      // Ré-afficher
      renderTodos();
    });

    // Créer le label avec le texte de la tâche
    const label = document.createElement("label");
    label.textContent = todo.text;

    // Créer le bouton de suppression
    const del = document.createElement("button");
    del.textContent = "❌";
    del.addEventListener("click", () => {
      // Trouver l'index de la tâche dans le tableau
      const index = todos.indexOf(todo);
      
      // Supprimer la tâche du tableau
      todos.splice(index, 1);
      
      // Sauvegarder
      save("todos", todos);
      
      // ✨ NOUVEAU: Mettre à jour les stats après suppression
      updateDailyStats();
      
      // Ré-afficher
      renderTodos();
    });

    // Assembler tous les éléments
    div.append(checkbox, label, del);
    todoContainer.appendChild(div);
  });
}