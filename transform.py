import tkinter as tk
from tkinter import filedialog, messagebox

def read_words_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            words = [line.strip() for line in file if line.strip()]
        return words
    except Exception as e:
        messagebox.showerror("Erreur", f"Impossible de lire le fichier : {e}")
        return []

def generate_js_array(words):
    # Créer une liste JavaScript
    js_array = "const words = [\n"
    
    # Ajouter les mots en morceaux pour une meilleure lisibilité
    for i, word in enumerate(words):
        js_array += f'    "{word}",\n'  # Indentation pour une meilleure lisibilité
    js_array = js_array.rstrip(",\n") + "\n];"  # Enlever la dernière virgule et ajouter la fermeture
    return js_array

def select_file():
    file_path = filedialog.askopenfilename(filetypes=[("Text Files", "*.txt")])
    if file_path:
        words = read_words_from_file(file_path)
        if words:
            js_code = generate_js_array(words)
            output_text.delete(1.0, tk.END)  # Effacer le texte précédent
            output_text.insert(tk.END, js_code)  # Insérer le code JavaScript

def save_to_file():
    js_code = output_text.get(1.0, tk.END).strip()  # Obtenir le texte dans la zone de texte
    if js_code:
        file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text Files", "*.txt")])
        if file_path:
            try:
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(js_code)
                messagebox.showinfo("Succès", "Le fichier a été enregistré avec succès.")
            except Exception as e:
                messagebox.showerror("Erreur", f"Impossible d'enregistrer le fichier : {e}")
    else:
        messagebox.showwarning("Avertissement", "Aucun code à enregistrer.")

def create_ui():
    global output_text, root

    root = tk.Tk()
    root.title("Générateur de Code JavaScript")
    
    # Créer un bouton pour sélectionner le fichier
    select_button = tk.Button(root, text="Sélectionner un fichier .txt", command=select_file)
    select_button.pack(pady=10)
    
    # Créer un bouton pour enregistrer le code
    save_button = tk.Button(root, text="Enregistrer le code", command=save_to_file)
    save_button.pack(pady=10)
    
    # Zone de texte pour afficher le code JavaScript
    output_text = tk.Text(root, width=80, height=20)
    output_text.pack(pady=10)
    
    # Bouton pour quitter l'application
    quit_button = tk.Button(root, text="Quitter", command=root.quit)
    quit_button.pack(pady=10)

    root.mainloop()

if __name__ == "__main__":
    create_ui()
