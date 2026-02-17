import os
import shutil  # module pour déplacer des fichiers

folder_path = "C:/Users/admin/Documents/essai"

# Dictionnaire pour définir les types
file_types = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
    "PDF": [".pdf"],
    "Documents": [".doc", ".docx", ".txt", ".odt"],
    "Audio": [".mp3", ".wav", ".aac"],
    "Videos": [".mp4", ".avi", ".mkv"]
}

# Lister les fichiers
files = os.listdir(folder_path)

for file in files:
    full_path = os.path.join(folder_path, file)
    
    if os.path.isfile(full_path):
        name, extension = os.path.splitext(file)
        
        moved = False
        
        # Cherche dans le dictionnaire
        for folder, extensions in file_types.items():
            if extension.lower() in extensions:
                
                # Crée le dossier s'il n'existe pas
                target_folder = os.path.join(folder_path, folder)
                os.makedirs(target_folder, exist_ok=True)
                
                # Déplace le fichier
                shutil.move(full_path, os.path.join(target_folder, file))
                print(f"{file} -> {folder}/")
                
                moved = True
                break
        
        # Si aucune catégorie ne correspond
        if not moved:
            target_folder = os.path.join(folder_path, "Autres")
            os.makedirs(target_folder, exist_ok=True)
            shutil.move(full_path, os.path.join(target_folder, file))
            print(f"{file} -> Autres/")
