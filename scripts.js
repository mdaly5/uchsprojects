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

  document.getElementById("shuffled-word").textContent = ""; // Add this

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

  input.value = "";
  input.focus();

}

// 🚀 STEP 6: Load everything on page load
window.onload = async () => {
  await loadDictionary();
  loadNewWord();
};


// Allow the enter key to work in place of clicking submit
document.getElementById("word-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    submitWord();
  }
});

function revealAnswers() {
  const missed = currentWord.validSubwords.filter(word => !foundWords.includes(word));
  const list = document.getElementById("word-list");

  missed.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    li.style.color = "gray";
    li.style.fontStyle = "italic";
    list.appendChild(li);
  });

  document.getElementById("feedback").textContent = "All words revealed!";
}

// Function that allows user to shuffle letters in the Word Builder App
function shuffleString(str) {
  const arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("").toUpperCase();
}

// Function to shuffle letters in word using shuffleString(str)

function shuffleLetters() {
  if (!currentWord.base) return;

  const shuffled = shuffleString(currentWord.base);
  document.getElementById("shuffled-word").textContent = `Shuffled: ${shuffled}`;
}

// Scripts for Fill in the Blank Game

document.addEventListener("DOMContentLoaded", async () => {
  const cards = document.querySelectorAll(".puzzle-card.fill-in-blank");
  if (!cards.length) {
    console.warn("No .puzzle-card.fill-in-blank found");
    return;
  }

  const fallbackQuestions = [
    { sentence: "His theory was highly ____ and difficult for most people to grasp.", answer: "abstract" },
    { sentence: "The ____ teacher donated her bonus to help struggling students.", answer: "benevolent" },
    { sentence: "After much discussion, they finally ____ on the best plan.", answer: "concurred" },
    { sentence: "She was ____ in her studies, never missing a homework assignment.", answer: "diligent" },
    { sentence: "He gave an ____ refusal to accept the offer.", answer: "emphatic" },
    { sentence: "The scientist worked to ____ a new solution to the problem.", answer: "formulate" },
    { sentence: "He expressed his deep ____ for their kindness.", answer: "gratitude" },
    { sentence: "She called him a ____ after he criticized dishonesty while lying himself.", answer: "hypocrite" },
    { sentence: "The judge’s ____ was respected by everyone in the courtroom.", answer: "judgment" },
    { sentence: "The study of motion is called ____.", answer: "kinetics" }
  ];

  for (const card of cards) {
    const jsonPath = card.dataset.questions || null;
    let questions = fallbackQuestions;

    if (jsonPath) {
      try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          questions = data;
        }
      } catch (err) {
        console.warn("Could not load questions.json, using fallback:", err);
      }
    }

    // Find existing elements
    const sentenceEl = card.querySelector(".fib-sentence");
    const answerEl = card.querySelector(".fib-answer");
    const checkBtn = card.querySelector(".fib-check");
    const resultEl = card.querySelector(".fib-result");
    const nextBtn = card.querySelector(".fib-next");
    const scoreEl = card.querySelector(".fib-score");

    let index = 0;
    let score = 0;
    let attempts = 0;

    function normalize(s) {
      return String(s || "").toLowerCase().trim();
    }

    function showQuestion() {
      const q = questions[index];
      sentenceEl.textContent = q.sentence.includes("____")
        ? q.sentence
        : q.sentence.replace(new RegExp(q.answer, "i"), "_____");
      answerEl.value = "";
      resultEl.textContent = "";
      scoreEl.textContent = `Score: ${score} / ${attempts}`;
    }

    function checkAnswer() {
      const q = questions[index];
      attempts++;
      if (normalize(answerEl.value) === normalize(q.answer)) {
        score++;
        resultEl.textContent = "✅ Correct!";
        resultEl.style.color = "green";
      } else {
        resultEl.textContent = `❌ Incorrect. The answer is "${q.answer}".`;
        resultEl.style.color = "red";
      }
      scoreEl.textContent = `Score: ${score} / ${attempts}`;
    }

    function nextQuestion() {
      index = (index + 1) % questions.length;
      showQuestion();
    }

    checkBtn.addEventListener("click", checkAnswer);
    nextBtn.addEventListener("click", nextQuestion);
    answerEl.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        checkAnswer();
      }
    });

    // Start
    showQuestion();
  }
});




