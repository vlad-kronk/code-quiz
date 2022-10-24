// initialize DOM hooks

// root hooks
var correctColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-correct');
var incorrectColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-incorrect');
var buttonBgColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-accent');

// splash screen hooks
var splashScreenEl = document.querySelector(".splash");
var startButtonEl = document.querySelector("#start-btn");
var hsButtonEl = document.querySelector("#hs-btn");

// quiz screen hooks
var quizScreenEl = document.querySelector(".quiz");
var timerEl = document.querySelector("#timer");
var questionNumEl = document.querySelector("#question-num");
var questionEl = document.querySelector("#question");
var optionsListEl = document.querySelector("ul");

// form screen hooks
var formScreenEl = document.querySelector(".form");
var scoreEl = document.getElementById("score");
var formEl = document.querySelector("form");
var nameEl = document.querySelector("#name-field");
var submitButtonEl = document.querySelector("#submit-btn");
var savedTextEl = document.querySelector(".form-content h2");

// initialize object to grab questions, options, and answers from
var qDict = {
    questions: [
        "Which of the following tags does NOT go in the <head> of a website?",
        "What character do you use to select an HTML class in CSS?",
        "How do you change text color in CSS?",
        "How do you declare a JavaScript constant?",
        "JavaScript is a strongly typed language.",
        "What HTML tag creates a nested webpage?",
        "Inside which HTML element do we put JavaScript?",
        "Where is the correct place to insert a JavaScript?",
        "What is the correct syntax for referring to a script called 'xxx.js'?",
        "How do you write a comment in JavaScript?",
        "What does the conditional ('4' == 4) evaulate to?"
    ],

    options: [
        ["<meta>", "<title>", "<section>", "<link>"],
        [":", ".", "#", "@"],
        ["background-color", "text-color", "color", "font-color"],
        ["var", "function", "const", "for"],
        ["true", "false"],
        ["<nest>", "<iframe>", "<frame>", "<page>"],
        ["<script>", "<javascript>", "<js>", "<scripting>"],
        ["the <head>", "the <body>", "both are correct"],
        ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>"],
        ["`This is a comment", "//This is a comment", "..This is a comment", "<!--This is a comment-->"],
        ["true", "false"]
    ],

    answers: [
        "<section>",
        ".",
        "color",
        "const",
        "false",
        "<iframe>",
        "<script>",
        "the <body>",
        "<script src='xxx.js'>",
        "//This is a comment",
        "true"
    ]
}

// global variables

var questionCounter = 0;
var globalScore = 0;
var timerInterval;
var timer = 30;
var scores = JSON.parse(localStorage.getItem("scores")) || [];


// helper functions

function resetVars() {
    questionCounter = 0;
    globalScore = 0;
    clearInterval(timerInterval);
    timer = 30;
}

// presents a question and the answer options
function ask(i) {
    questionNumEl.textContent = "Question " + (i + 1);
    questionEl.textContent = qDict.questions[i];
    document.querySelectorAll("ul button").forEach(button => {
        button.remove();
    })

    for (var j = 0; j < qDict.options[i].length; j++) {
        var tempEl = document.createElement("button");
        tempEl.setAttribute("class", "btn");
        tempEl.textContent = "" + qDict.options[i][j];
        optionsListEl.append(tempEl);
    }

}

function play() {
    ask(questionCounter);
    var options = document.querySelectorAll("ul button");
    options.forEach(button => {
        button.addEventListener("click", event => {
            if (button.textContent === qDict.answers[questionCounter]) {
                console.log("correct");
                globalScore++;
            } else {
                console.log("incorrect");
                timer = timer - 2;
            }

            if (questionCounter < qDict.questions.length-1) { questionCounter++; play(); }
            else { form(globalScore); }
        })
    })
}


// 
function logScore(event) {
    event.preventDefault();
    scores.unshift({name: nameEl.value, score: globalScore})
    localStorage.setItem("scores", JSON.stringify(scores));
    savedTextEl.style.display = "block";
    formEl.removeEventListener("submit", logScore);
}

function showHighscores() {
    var result = "";
    var current = JSON.parse(localStorage.getItem("scores"));
    if (current !== null) {
        current.forEach(obj => {
            var app = "Name: " + obj.name + " | Score: " + obj.score + "\n";
            result = result + app;
        });
    } else {
        result = "No highscores yet!";
    }
    window.alert(result);
}



function splash() {
    // show splash screen, hide other screens
    splashScreenEl.style.display = "block";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "none";
    resetVars();


    startButtonEl.addEventListener("click", quiz);

    hsButtonEl.addEventListener("click", showHighscores);

}

function quiz() {

    timer = 30;

    // show quiz screen, hide other screens
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "block";
    formScreenEl.style.display = "none";

    timerInterval = setInterval(function() {
        timerEl.textContent = "Timer: " + timer;
        if (timer > 0) {
            timer--;
        } else {
            clearInterval(timerInterval);
            form();
            return;
        }
    }, 1000);

    play();
}

function form() {

    clearInterval(timerInterval);

    // show form screen, hide other screens
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "block";

    scoreEl.textContent = globalScore;

    formEl.addEventListener("submit", logScore);

}

function main() {

    splash();

}

main();