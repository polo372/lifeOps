import random
import time

print("Bienvenue dans LifeOps Adventure ! 🏰")
player_name = input("Quel est ton nom aventurier ? ")

print(f"\nSalut {player_name} ! Ta mission : accomplir 3 tâches importantes aujourd'hui.\n")

tasks = ["Écrire un script Python", "Ranger ton bureau", "Boire un café"]
completed = []

for task in tasks:
    print(f"Tâche à accomplir : {task}")
    action = input("Que veux-tu faire ? (1: tenter / 2: ignorer) ")

    if action == "1":
        success = random.choice([True, False])
        if success:
            print(f"✅ Bravo ! Tu as réussi : {task}\n")
            completed.append(task)
        else:
            print(f"❌ Oups ! Tu as échoué : {task}\n")
    else:
        print(f"⚠️ Tu as ignoré la tâche : {task}\n")

print("--- Résultat final ---")
print(f"Tâches accomplies : {len(completed)}/{len(tasks)}")
for t in completed:
    print(f" - {t}")

print("\nMerci d'avoir joué à LifeOps Adventure ! 🎉")