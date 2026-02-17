import os
import shutil
import time
import json
import random

# --------------------------
# Configuration initiale
# --------------------------
DATA_FILE = "lifeops_data.json"

file_types = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    "PDF": [".pdf"],
    "Documents": [".doc", ".docx", ".txt", ".odt"],
    "Audio": [".mp3", ".wav", ".aac"],
    "Videos": [".mp4", ".avi", ".mkv"]
}

# --------------------------
# Fonctions utilitaires
# --------------------------

# Charger ou créer la base de données
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        return {"tasks": []}

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

# --------------------------
# To-Do List
# --------------------------
def show_tasks(data):
    if not data["tasks"]:
        print("📝 Pas de tâches pour l'instant !")
        return
    print("\n--- To-Do List ---")
    for i, task in enumerate(data["tasks"], 1):
        status = "✅" if task["done"] else "❌"
        print(f"{i}. {task['name']} [{status}]")

def add_task(data):
    task_name = input("Nom de la tâche : ")
    data["tasks"].append({"name": task_name, "done": False})
    save_data(data)
    print("✅ Tâche ajoutée !")

def complete_task(data):
    show_tasks(data)
    try:
        choice = int(input("Numéro de la tâche terminée : "))
        data["tasks"][choice-1]["done"] = True
        save_data(data)
        print("🎉 Tâche marquée comme terminée !")
    except:
        print("⚠️ Numéro invalide.")

# --------------------------
# Organisation de fichiers
# --------------------------
def organize_folder():
    folder_path = input("📂 Chemin du dossier à organiser : ")
    if not os.path.exists(folder_path):
        print("❌ Dossier introuvable !")
        return

    files = os.listdir(folder_path)
    stats = {}
    for file in files:
        full_path = os.path.join(folder_path, file)
        if os.path.isfile(full_path):
            name, extension = os.path.splitext(file)
            moved = False
            for folder, extensions in file_types.items():
                if extension.lower() in extensions:
                    target_folder = os.path.join(folder_path, folder)
                    os.makedirs(target_folder, exist_ok=True)
                    shutil.move(full_path, os.path.join(target_folder, file))
                    stats[folder] = stats.get(folder,0)+1
                    moved = True
                    break
            if not moved:
                target_folder = os.path.join(folder_path, "Autres")
                os.makedirs(target_folder, exist_ok=True)
                shutil.move(full_path, os.path.join(target_folder, file))
                stats["Autres"] = stats.get("Autres",0)+1
    print("\n--- Organisation terminée ---")
    for category, count in stats.items():
        print(f"{category}: {count} fichier(s) déplacé(s)")

# --------------------------
# Timer Pomodoro simple
# --------------------------
def pomodoro():
    try:
        duration = int(input("Durée du Pomodoro en minutes : "))
    except:
        duration = 25
        print("Valeur invalide, durée par défaut 25 min.")
    seconds = duration * 60
    print(f"⏱️ Pomodoro démarré pour {duration} minutes...")
    while seconds > 0:
        mins, secs = divmod(seconds, 60)
        timer = f"{mins:02d}:{secs:02d}"
        print(timer, end="\r")
        time.sleep(1)
        seconds -= 1
    print("\n🎉 Pomodoro terminé ! Repos bien mérité.")

# --------------------------
# Menu principal
# --------------------------
def main():
    data = load_data()
    while True:
        print("\n--- LifeOps AI Assistant ---")
        print("1. Voir la To-Do List")
        print("2. Ajouter une tâche")
        print("3. Terminer une tâche")
        print("4. Organiser un dossier")
        print("5. Pomodoro")
        print("0. Quitter")
        choice = input("Choix : ")
        if choice == "1":
            show_tasks(data)
        elif choice == "2":
            add_task(data)
        elif choice == "3":
            complete_task(data)
        elif choice == "4":
            organize_folder()
        elif choice == "5":
            pomodoro()
        elif choice == "0":
            print("👋 À bientôt !")
            break
        else:
            print("⚠️ Choix invalide.")

if __name__ == "__main__":
    main()
