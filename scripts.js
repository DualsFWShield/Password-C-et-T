// JavaScript pour la gestion des catégories et des mots à inclure
const categoryList = document.getElementById("categoryList");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categorySelect = document.getElementById("categorySelect");
const addWordBtn = document.getElementById("addWordBtn");
const includeWordInput = document.getElementById("includeWord");

let categories = []; // Tableau qui stocke l'ordre des catégories

function updateCategoryList() {
    categoryList.innerHTML = ""; // Vider la liste avant de la reconstruire
    categories.forEach((category, index) => {
        const li = document.createElement("li");
        li.className = "category-item";
        li.innerHTML = `
                    <span>${category}</span>
                    <button class="icon-btn-move-up" onclick="moveUp(${index})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button class="icon-btn-move-down" onclick="moveDown(${index})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button class="icon-btn-remove" onclick="removeCategory(${index})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                `;
        categoryList.appendChild(li);
    });
}

function addCategory() {
    const selectedCategory = categorySelect.value;
    categories.push(selectedCategory);
    updateCategoryList();
}

function addWord() {
    const word = includeWordInput.value.trim();
    if (word !== "") {
        categories.push(word);
        includeWordInput.value = ""; // Reset input field
        updateCategoryList();
    }
}

function moveUp(index) {
    if (index > 0) {
        [categories[index - 1], categories[index]] = [categories[index], categories[index - 1]];
        updateCategoryList();
    }
}

function moveDown(index) {
    if (index < categories.length - 1) {
        [categories[index], categories[index + 1]] = [categories[index + 1], categories[index]];
        updateCategoryList();
    }
}

function removeCategory(index) {
    categories.splice(index, 1);
    updateCategoryList();
}

addCategoryBtn.addEventListener("click", addCategory);
addWordBtn.addEventListener("click", addWord);

// Générer le(s) mot(s) de passe et l'afficher
document.getElementById("generateBtn").addEventListener("click", function () {
  const numPasswords = document.getElementById("numberOfPasswords").value;
  const generatedPasswords = generatePasswords(numPasswords);
  document.getElementById("generatedPassword").value = generatedPasswords.join("\n");
});

// Copier le(s) mot(s) de passe
document.getElementById("copyBtn").addEventListener("click", function () {
  const textarea = document.getElementById("generatedPassword");
  textarea.select();
  document.execCommand("copy");
  alert("Mot de passe copié !");
});

// Enregistrer en fichier .txt
document.getElementById("saveBtn").addEventListener("click", function () {
  const text = document.getElementById("generatedPassword").value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "mot_de_passe.txt";
  link.click();
});

// Fonction principale de génération (sans remainingLength)
function generatePasswords(numPasswords) {
  const passwords = [];
  for (let i = 0; i < numPasswords; i++) {
    let password = "";
    // Pour chaque catégorie sélectionnée, ajouter un caractère ou mot
    for (let category of categories) {
      switch (category) {
        case "symboles":
          password += getRandomSymbol();
          break;
        case "chiffres":
          password += getRandomNumber();
          break;
        case "lettre-maj":
          password += getRandomUppercaseLetter();
          break;
        case "lettre-min":
          password += getRandomLowercaseLetter();
          break;
        case "mot-aleatoire":
          password += getRandomWord();
          break;
        default:
          // Si c'est un mot ajouté par l'utilisateur
          password += category;
      }
    }
    passwords.push(password);
  }
  return passwords;
}

// Fonctions d'utilitaires pour générer des caractères
function getRandomSymbol() {
    const symbols = "!@#$%^&*()_+{}[]|:;<>,.?/~`";
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10).toString();
}

function getRandomUppercaseLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function getRandomLowercaseLetter() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26));
}

let words = [];

// Charger les mots depuis list.json
fetch('list.json')
    .then(response => response.json())
    .then(data => {
        words = data.words;
    })
    .catch(error => console.error('Erreur lors du chargement des mots:', error));

function getRandomWord() {
    if (words.length === 0) {
        document.getElementById('random-word').innerText = "Aucun mot chargé.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    document.getElementById('random-word').innerText = randomWord;
}

// Estimation du temps de crack pour un mot de passe donné
function estimateCrackTime(password) {
    const length = password.length;
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+{}[]|:;<>,.?/~`";

    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += lowercase.length;
    if (/[A-Z]/.test(password)) charsetSize += uppercase.length;
    if (/[0-9]/.test(password)) charsetSize += numbers.length;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += symbols.length;

    // Estimation du temps de crack en secondes
    const attemptsPerSecond = 1000000000; // 1 milliard d'essais par seconde
    const totalCombinations = Math.pow(charsetSize, length);
    const secondsToCrack = totalCombinations / attemptsPerSecond;

    // Convertir le temps en secondes, minutes, heures, jours, années, microsecondes
    const timeUnits = {
        years: Math.floor(secondsToCrack / (60 * 60 * 24 * 365)),
        days: Math.floor((secondsToCrack % (60 * 60 * 24 * 365)) / (60 * 60 * 24)),
        hours: Math.floor((secondsToCrack % (60 * 60 * 24)) / (60 * 60)),
        minutes: Math.floor((secondsToCrack % (60 * 60)) / 60),
        seconds: Math.floor(secondsToCrack % 60),
        microseconds: Math.floor((secondsToCrack - Math.floor(secondsToCrack)) * 1000000) // Calcul des microsecondes
    };

    return timeUnits;
}

// Gérer l'événement de clic pour estimer le temps de crack
document.getElementById("estimateBtn").addEventListener("click", function () {
    const password = document.getElementById("estimatePassword").value.trim();
    if (password) {
        const estimate = estimateCrackTime(password);
        document.getElementById("timeEstimate").innerText = `Estimation du temps de crack : 
        ${estimate.years} ans, 
        ${estimate.days} jours, 
        ${estimate.hours} heures, 
        ${estimate.minutes} minutes, 
        ${estimate.seconds} secondes, 
        ${estimate.microseconds} microsecondes.`;
    } else {
        document.getElementById("timeEstimate").innerText = "Veuillez entrer un mot de passe.";
    }
});