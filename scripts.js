// 📁 act_words.txt must be in your project folder

let dictionary = []; // All valid ACT-level words
const baseWords = [
  "abstract",
  "benevolent",
  "diligent",
  "emphatic",
  "formulate",
  "gratitude",
  "hypocrite",
  "kinetics",
  "lucrative",
  "metaphor",
  "obsolete",
  "paradigm",
  "quandary",
  "resolute",
  "saturate",
  "tenacity",
  "validate"
];

let currentWord = {};      // The current base word
let foundWords = [];       // Words the student has found
let score = 0;             // Student score

// 🔄 STEP 1: Load the act_words.txt file
async function loadDictionary() {
  const res = await fetch("filtered_words.txt");
  const text = await res.text();
  dictionary = text.split("\n").map(word => word.trim().toLowerCase());
}

// ✅ STEP 2: Check if word can be made from base word letters
function isMadeFromBase(word, base) {
  let baseLetters = base.split("");

  for (let letter of word) {
    let index = baseLetters.indexOf(letter);
    if (index === -1) return false;
    baseLetters.splice(index, 1); // Remove used letter
  }

  return true;
}

// 🔍 STEP 3: Get all valid dictionary words that can be made from base
function getValidSubwords(baseWord) {
  const results = new Set();
  const maxLen = baseWord.length;

  for (let word of dictionary) {
    if (
      word.length >= 3 &&
      word.length <= maxLen &&
      isMadeFromBase(word, baseWord)
    ) {
      results.add(word);
    }
  }

  return Array.from(results);
}

// 🆕 STEP 4: Load a new base word and calculate valid subwords
async function loadNewWord() {
  const randomBase = baseWords[Math.floor(Math.random() * baseWords.length)];
  currentWord.base = randomBase;

  // Clear UI
  document.getElementById("base-word").textContent = currentWord.base;
  document.getElementById("word-list").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent = "0";
  document.getElementById("word-input").value = "";

  // Reset state
  foundWords = [];
  score = 0;

  // Get valid subwords and store
  const validSubwords = getValidSubwords(currentWord.base);
  currentWord.validSubwords = validSubwords;

  // Show count to student
  document.getElementById("word-count").textContent =
    `There are ${validSubwords.length} possible words.`;
}

// 📝 STEP 5: Handle student guesses
function submitWord() {
  const input = document.getElementById("word-input");
  const feedback = document.getElementById("feedback");
  const wordList = document.getElementById("word-list");
  const scoreDisplay = document.getElementById("score");

  const word = input.value.toLowerCase().trim();

  if (!word) {
    feedback.textContent = "Enter a word!";
    return;
  }

  if (foundWords.includes(word)) {
    feedback.textContent = "Already found!";
    input.value = "";
    return;
  }

  if (!isMadeFromBase(word, currentWord.base)) {
    feedback.textContent = `Only use letters from "${currentWord.base}"!`;
    input.value = "";
    return;
  }

  if (!dictionary.includes(word)) {
    feedback.textContent = `"${word}" is not in the word list.`;
    input.value = "";
    return;
  }

  // Success!
  foundWords.push(word);
  const li = document.createElement("li");
  li.textContent = word;
  wordList.appendChild(li);

  score += 1;
  scoreDisplay.textContent = score;
  feedback.textContent = "Nice!";
  input.value = "";
}

// 🚀 STEP 6: Load everything on page load
window.onload = async () => {
  await loadDictionary();
  loadNewWord();
};
