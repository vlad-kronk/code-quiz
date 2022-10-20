// initialize DOM hooks

// root hooks
var rootEl = document.querySelector(":root");

// splash screen hooks
var splashScreenEl = document.querySelector(".splash");
var startButtonEl = document.querySelector("#start-btn");
var hsButtonEl = document.querySelectorAll("#hs-btn");

// quiz screen hooks
var quizScreenEl = document.querySelector(".quiz");
var timerEl = document.querySelector("#timer");
var questionNumEl = document.querySelector("#question-num");
var questionEl = document.querySelector("#question");
var optionsListEl = document.querySelector("ul");

// form screen hooks
var formScreenEl = document.querySelector(".form");
var scoreEl = document.getElementById("score");
var nameEl = document.querySelector("#name-field");
var submitButtonEl = document.querySelector("#submit-btn");

// console.log(splashScreenEl);
// console.log(startButtonEl);
// console.log(hsButtonEl);

// initialize object to grab questions, options, and answers from
var qDict = {
    questions: [
        "Which of the following tags does NOT go in the <head> of a website?",
        "What character do you use to select an HTML class in CSS?",
        "How do you change text color in CSS?",
        "How do you declare a JavaScript constant?",
        "JavaScript is a strongly typed language.",
        "What HTML tag creates a nested webpage?"
    ],

    options: [
        ["<meta>", "<title>", "<section>", "<link>"],
        [":", ".", "#", "@"],
        ["background-color", "text-color", "color", "font-color"],
        ["var", "function", "const", "for"],
        ["true", "false", "", ""],
        ["<nest>", "<iframe>", "<frame>", "<page>"]
    ],

    answers: [
        "<section>",
        ".",
        "color",
        "const",
        "false",
        "<iframe>"
    ]
}

// helper functions

// presents a question and the answer options
function ask(i) {
    questionNumEl.textContent = "Question " + (i + 1);
    questionEl.textContent = qDict.questions[i];
    for (var j = 0; j < qDict.options[i].length; j++) {
        var tempEl = document.createElement("button");
        tempEl.setAttribute("class", "btn");
        tempEl.textContent = "" + qDict.options[i][j];
        console.log(tempEl);
        optionsListEl.append(tempEl);
    }
}


function init() {

}

function splash() {
    // show splash screen, hide other screens
    splashScreenEl.style.display = "block";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "none";

    startButtonEl.addEventListener("click", function() {
        var score = quiz();
        // form(score);
    });
}

function quiz() {
    // show quiz screen, hide other screens
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "block";
    formScreenEl.style.display = "none";

    var timer = 30;
    var score = 0;


    var x = setInterval(function() {
        timerEl.textContent = "Timer: " + timer;
        if (timer > 0) {
            timer--;
        } else {
            clearInterval();
            return score;
        }
    }, 1000);

    for (var i = 0; i < qDict.questions.length; i++) {
        ask(i);
    }

}

function form(score) {
    // show form screen, hide other screens
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "block";

}

init();

splash();