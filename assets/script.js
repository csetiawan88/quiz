// List of Variables
let containerQuestionEl = document.getElementById("question-container");
let containerStartEl = document.getElementById("starter-container");
let containerEndEl = document.getElementById("end-container");
let containerScoreEl = document.getElementById("score-banner");
let formInitials = document.getElementById("initials-form");
let containerHighScoresEl = document.getElementById("high-score-container");
let ViewHighScoreEl = document.getElementById("view-high-scores");
let listHighScoreEl = document.getElementById("high-score-list");
let correctEl = document.getElementById("correct");
let wrongEl = document.getElementById("wrong");
let btnStartEl = document.querySelector("#start-game");
let btnGoBackEl = document.querySelector("#go-back");
let btnClearScoresEl = document.querySelector("#clear-high-scores");
let questionEl = document.getElementById("question");
let answerbuttonsEl = document.getElementById("answer-buttons");
let timerEl = document.querySelector("#timer");
let score = 0;
let timeleft;
let gameover;
let HighScores = [];
let arrayShuffledQuestions;
let QuestionIndex = 0;

timerEl.innerText = 0;

//Go Back Button Functions.
let renderStartPage = function () {
  containerHighScoresEl.classList.add("hide");
  containerHighScoresEl.classList.remove("show");
  containerStartEl.classList.remove("hide");
  containerStartEl.classList.add("show");
  containerScoreEl.removeChild(containerScoreEl.lastChild);
  QuestionIndex = 0;
  gameover = "";
  timerEl.textContent = 0;
  score = 0;

  if ((correctEl.className = "show")) {
    correctEl.classList.remove("show");
    correctEl.classList.add("hide");
  }
  if ((wrongEl.className = "show")) {
    wrongEl.classList.remove("show");
    wrongEl.classList.add("hide");
  }
};

//Timer functions.

let setTime = function () {
  timeleft = 75;

  let timercheck = setInterval(function () {
    timerEl.innerText = timeleft;
    timeleft--;

    if (gameover) {
      clearInterval(timercheck);
    }

    if (timeleft < 0) {
      showScore();
      timerEl.innerText = 0;
      clearInterval(timercheck);
    }
  }, 1000);
};

// Start game and questions shuffle function
let startGame = function () {
  containerStartEl.classList.add("hide");
  containerStartEl.classList.remove("show");
  containerQuestionEl.classList.remove("hide");
  containerQuestionEl.classList.add("show");
  arrayShuffledQuestions = questions.sort(() => Math.random() - 0.5);
  setTime();
  setQuestion();
};

// Next Question functions.
let setQuestion = function () {
  resetAnswers();
  displayQuestion(arrayShuffledQuestions[QuestionIndex]);
};

// Reset Answer
let resetAnswers = function () {
  while (answerbuttonsEl.firstChild) {
    answerbuttonsEl.removeChild(answerbuttonsEl.firstChild);
  }
};

//display correct
let answerCorrect = function () {
  if ((correctEl.className = "hide")) {
    correctEl.classList.remove("hide");
    correctEl.classList.add("banner");
    wrongEl.classList.remove("banner");
    wrongEl.classList.add("hide");
  }
};

//display wrong
let answerWrong = function () {
  if ((wrongEl.className = "hide")) {
    wrongEl.classList.remove("hide");
    wrongEl.classList.add("banner");
    correctEl.classList.remove("banner");
    correctEl.classList.add("hide");
  }
};

// display question functions
let displayQuestion = function (index) {
  questionEl.innerText = index.q;
  for (let i = 0; i < index.choices.length; i++) {
    let answerbutton = document.createElement("button");
    answerbutton.innerText = index.choices[i].choice;
    answerbutton.classList.add("btn");
    answerbutton.classList.add("answerbtn");
    answerbutton.addEventListener("click", answerCheck);
    answerbuttonsEl.appendChild(answerbutton);
  }
};

// function to check if answer is correct.
let answerCheck = function (event) {
  let selectedanswer = event.target;
  if (arrayShuffledQuestions[QuestionIndex].a === selectedanswer.innerText) {
    answerCorrect();
    score = score + 10;
  } else {
    answerWrong();
    score = score - 2;
    timeleft = timeleft - 10;
  }

  // check for any more questions
  QuestionIndex++;
  if (arrayShuffledQuestions.length > QuestionIndex + 1) {
    setQuestion();
  } else {
    gameover = "true";
    showScore();
  }
};

// Display score function
let showScore = function () {
  containerQuestionEl.classList.add("hide");
  containerEndEl.classList.remove("hide");
  containerEndEl.classList.add("show");

  let scoreDisplay = document.createElement("p");
  scoreDisplay.innerText = "Your final score is " + score + "!";
  containerScoreEl.appendChild(scoreDisplay);
};

// create high score function
let createHighScore = function (event) {
  event.preventDefault();
  let initials = document.querySelector("#initials").value;
  if (!initials) {
    alert("Please enter your intials");
    return;
  }

  formInitials.reset();

  let HighScore = {
    initials: initials,
    score: score,
  };

  //push and sort scores 
  HighScores.push(HighScore);
  HighScores.sort((a, b) => {
    return b.score - a.score;
  });

  //clear visibile list to resort
  while (listHighScoreEl.firstChild) {
    listHighScoreEl.removeChild(listHighScoreEl.firstChild);
  }
  //create elements in order of high scores
  for (let i = 0; i < HighScores.length; i++) {
    let highscoreEl = document.createElement("li");
    highscoreEl.ClassName = "high-score";
    highscoreEl.innerHTML =
      HighScores[i].initials + " - " + HighScores[i].score;
    listHighScoreEl.appendChild(highscoreEl);
  }

  saveHighScore();
  displayHighScores();
};
//save high score
let saveHighScore = function () {
  localStorage.setItem("HighScores", JSON.stringify(HighScores));
};

// save high scores in local storage and converted with JSON
let loadHighScore = function () {
  let LoadedHighScores = localStorage.getItem("HighScores");
  if (!LoadedHighScores) {
    return false;
  }

  LoadedHighScores = JSON.parse(LoadedHighScores);
  LoadedHighScores.sort((a, b) => {
    return b.score - a.score;
  });

  for (let i = 0; i < LoadedHighScores.length; i++) {
    let highscoreEl = document.createElement("li");
    highscoreEl.ClassName = "high-score";
    highscoreEl.innerText =
      LoadedHighScores[i].initials + " - " + LoadedHighScores[i].score;
    listHighScoreEl.appendChild(highscoreEl);

    HighScores.push(LoadedHighScores[i]);
  }
};

//display high score screen from link or when intiials entered
let displayHighScores = function () {
  containerHighScoresEl.classList.remove("hide");
  containerHighScoresEl.classList.add("show");
  gameover = "true";

  if ((containerEndEl.className = "show")) {
    containerEndEl.classList.remove("show");
    containerEndEl.classList.add("hide");
  }
  if ((containerStartEl.className = "show")) {
    containerStartEl.classList.remove("show");
    containerStartEl.classList.add("hide");
  }

  if ((containerQuestionEl.className = "show")) {
    containerQuestionEl.classList.remove("show");
    containerQuestionEl.classList.add("hide");
  }

  if ((correctEl.className = "show")) {
    correctEl.classList.remove("show");
    correctEl.classList.add("hide");
  }

  if ((wrongEl.className = "show")) {
    wrongEl.classList.remove("show");
    wrongEl.classList.add("hide");
  }
};
// View high scores & removes
let clearScores = function () {
  HighScores = [];

  while (listHighScoreEl.firstChild) {
    listHighScoreEl.removeChild(listHighScoreEl.firstChild);
  }

  localStorage.clear(HighScores);
};

loadHighScore();

btnStartEl.addEventListener("click", startGame);
formInitials.addEventListener("submit", createHighScore);
ViewHighScoreEl.addEventListener("click", displayHighScores);
btnGoBackEl.addEventListener("click", renderStartPage);
btnClearScoresEl.addEventListener("click", clearScores);

