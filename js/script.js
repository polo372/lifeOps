// script.js
import { initTodo } from "./todo.js";
import { save, load } from "./storage.js";
import { initTimer } from "./timer.js";

// 📅 Date
const dateElement = document.getElementById("date");
const today = new Date();

dateElement.textContent = today.toLocaleDateString("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

// 🎯 Objectif du jour
const objectifElement = document.getElementById("objectif");
const editButton = document.getElementById("edit-objectif");

const savedGoal = load("dailyGoal");
if (savedGoal) objectifElement.textContent = savedGoal;

editButton.addEventListener("click", () => {
  const goal = prompt("Quel est ton objectif du jour ?");
  if (goal && goal.trim()) {
    objectifElement.textContent = goal;
    save("dailyGoal", goal);
  }
});

// 📝 Todo
initTodo();

const themeToggle = document.getElementById("theme-toggle");

// Chargement du thème
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  themeToggle.textContent = isDark ? "☀️" : "🌙";
});


initTimer();