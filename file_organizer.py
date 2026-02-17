import os

# Chemin du dossier à organiser
folder_path = "C:\Users\admin\Documents\essai"

# Lister les fichiers
files = os.listdir(folder_path)

for file in files:
    print(file)
