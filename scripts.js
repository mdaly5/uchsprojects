const wordData = [
  { base: "teacher" },
  { base: "planet" },
  { base: "friend" },
  { base: "library" },
  { base: "garden" },
  { base: "machine" },
  { base: "triangle" },
  { base: "holiday" }
];

let currentWord = {};
let foundWords = [];
let score = 0;

// Loads a new random base word
function loadNewWord() {
  currentWord = wordData[Math.floor(Math.random() * wordData.length)];

  document.getElementById("base-word").textContent = currentWord.base;
  document.getElementById("word-list").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent = "0";
  document.getElementById("word-input").value = "";

  foundWords = [];
  score = 0;
}

// Checks if a word is made only from letters in base word
function isMadeFromBase(word, base) {
  let baseLetters = base.split("");
  for (let letter of word) {
    let index = baseLetters.indexOf(letter);
    if (index === -1) return false;
    baseLetters.splice(index, 1);
  }
  return true;
}

// Calls dictionary API to validate a word
async function isRealWord(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  return response.ok;
}

// Handles user input
async function submitWord() {
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

  const isValid = await isRealWord(word);
  if (!isValid) {
    feedback.textContent = `"${word}" is not a valid word.`;
    input.value = "";
    return;
  }

  // Valid entry!
  foundWords.push(word);
  const li = document.createElement("li");
  li.textContent = word;
  wordList.appendChild(li);

  score += 1;
  scoreDisplay.textContent = score;
  feedback.textContent = "Nice!";
  input.value = "";
}

// Load first word on page load
window.onload = loadNewWord;
