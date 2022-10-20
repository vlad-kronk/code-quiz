// initialize DOM hooks

// root hooks
var correctColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-correct');
var incorrectColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-incorrect');
var buttonBgColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-accent');

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
var formEl = document.querySelector("form");
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
        ["true", "false"],
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

// global variables

var questionCounter = 0;
var globalScore = 0;

// helper functions

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
                // button.style.backgroundColor = "" + correctColor + ";";
                // button.style.transition = "0.2s ease;";
                // button.style.backgroundColor = "" + buttonBgColor + ";";
                // button.style.transition = null;
            } else {
                console.log("incorrect");
            }

            if (questionCounter < qDict.questions.length-1) { questionCounter++; play(); }
            else { form(globalScore); }
        })
    })
    
}

function logScore(event) {
    event.preventDefault();
    var key = nameEl.value;
    localStorage.setItem(key, globalScore);
    splash();
}

function splash() {
    // show splash screen, hide other screens
    splashScreenEl.style.display = "block";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "none";

}

function quiz() {
    // show quiz screen, hide other screens
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "block";
    formScreenEl.style.display = "none";

    var timer = 30;

    setInterval(function() {
        timerEl.textContent = "Timer: " + timer;
        if (timer > 0) {
            timer--;
        } else {
            clearInterval();
            form(globalScore);
            return;
        }
    }, 1000);

    play();
}

function form(score) {
    // show form screen, hide other screens
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "block";

    scoreEl.textContent = globalScore;

    formEl.addEventListener("submit", logScore);

}

function main() {

    splash();
 
    startButtonEl.addEventListener("click", function() {
        quiz();
    });

}

main();