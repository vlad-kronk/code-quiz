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

// highscore screen hooks
var hsScreenEl = document.querySelector(".highscore");
var hsTableEl = document.querySelector("table");
var hsBackButtonEl = document.querySelector(".highscore button");

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
var timerInterval;
var globalTimer = 30;

var highscores = JSON.parse(localStorage.getItem("scores")) || [];

// helper functions

// resets variables
function resetVars() {
    questionCounter = 0;
    globalScore = 0;
    globalTimer = 30;
    clearInterval(timerInterval);
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
                // button.style.backgroundColor = "" + correctColor + ";";
                // button.style.transition = "0.2s ease;";
                // button.style.backgroundColor = "" + buttonBgColor + ";";
                // button.style.transition = null;
            } else {
                console.log("incorrect");
                globalTimer -= 2;
            }

            if (questionCounter < qDict.questions.length-1) { questionCounter++; play(); }
            else { form(globalScore); }
        })
    })
    
}


// 
function logScore(event) {
    event.preventDefault();
    
    // grab high scores from storage
    highscores = JSON.parse(localStorage.getItem("scores"));

    // insert the players score at the beginning of the array
    highscores.unshift({name: nameEl.value, score: globalScore});
    
    // key is 0, starting pos of current score
    var key = 0;

    // iterate over the array, starting from the item after the current score
    for (var i = 1; i < highscores.length; i++) {
        // if the iterator score is greater than the key score, swap them
        if (highscores[i].score > highscores[key].score) {
            var temp = highscores[key];
            highscores[key] = highscores[i];
            highscores[i] = temp;
            key = i;
        }
        // if the iterator score is lower than the key score, sort is done
        else {
            break;
        }
    }

    // store sorted array in local storage
    localStorage.setItem("scores", JSON.stringify(highscores));

    // reset variables and head back to splash screen
    resetVars();
    splash();
}

function splash() {
    // show splash screen, hide other screens
    splashScreenEl.style.display = "block";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "none";
    hsScreenEl.style.display = "none";

    startButtonEl.addEventListener("click", function() {
        quiz();
    });

    hsButtonEl[0].addEventListener("click", function() {
        highscore();
    });

}

function quiz() {
    // show quiz screen, hide other screens
    timerEl.textContent = "Timer: " + globalTimer;

    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "block";
    formScreenEl.style.display = "none";
    hsScreenEl.style.display = "none";

    hsButtonEl[1].addEventListener("click", function() {
        highscore();
    });

    timerInterval = setInterval(function() {
        timerEl.textContent = "Timer: " + globalTimer;
        if (globalTimer > 0) {
            globalTimer--;
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
    hsScreenEl.style.display = "none";

    scoreEl.textContent = globalScore;

    formEl.addEventListener("submit", logScore);

}

function highscore() {
    splashScreenEl.style.display = "none";
    quizScreenEl.style.display = "none";
    formScreenEl.style.display = "none";
    hsScreenEl.style.display = "block";

    resetVars();
    
    

    for(let i = 0; i < highscores.length; i++) {
        // display high scores
        let lastRow = hsTableEl.insertRow();
        lastRow.insertCell().textContent = highscores[i].name;
        lastRow.insertCell().textContent = highscores[i].score;
    }

    hsBackButtonEl.addEventListener("click", function() {

        let rows = document.querySelectorAll("tr");
        console.log(rows);
        for(var i = 1; i < rows.length; i++) {
            // var cells = rows[i].children;
            // cells.forEach(cell, function() {
            //     cell.remove();
            // })
            rows[i].remove();
        }

        splash();
    });

}

function main() {

    splash();

}

main();