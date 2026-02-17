import os
import shutil

# Dictionnaire pour définir les types
file_types = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    "PDF": [".pdf"],
    "Documents": [".doc", ".docx", ".txt", ".odt"],
    "Audio": [".mp3", ".wav", ".aac"],
    "Videos": [".mp4", ".avi", ".mkv"]
}

def organize_folder(folder_path):
    if not os.path.exists(folder_path):
        print("Erreur : dossier introuvable !")
        return

    files = os.listdir(folder_path)
    stats = {}  # compteur par catégorie

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
                    stats[folder] = stats.get(folder, 0) + 1
                    moved = True
                    break

            if not moved:
                target_folder = os.path.join(folder_path, "Autres")
                os.makedirs(target_folder, exist_ok=True)
                shutil.move(full_path, os.path.join(target_folder, file))
                stats["Autres"] = stats.get("Autres", 0) + 1

    # Résumé
    print("\n--- Organisation terminée ---")
    for category, count in stats.items():
        print(f"{category}: {count} fichier(s) déplacé(s)")

if __name__ == "__main__":
    folder_path = input("📂 Entrez le chemin du dossier à organiser : ")
    organize_folder(folder_path)
