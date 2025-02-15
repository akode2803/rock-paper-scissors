const images = {
    rock : '<img src="img/rock-emoji.png" class="button-image" alt="paper">',
    paper : '<img src="img/paper-emoji.png" class="button-image" alt="paper">',
    scissors : '<img src="img/scissors-emoji.png" class="button-image" alt="paper">'
};

const messages = {
    win : "You win!",
    lose : "You lose",
    tie : "Tie"
};

document.body.addEventListener('keydown', keyboardInput);
function keyboardInput(event) {
    const keyPressed = event.key;
    let choice = '';
    if (keyPressed === 'r' || keyPressed === 'ArrowLeft') choice = 'rock';
    else if (keyPressed === 'p'  || keyPressed === 'ArrowUp') choice = 'paper';
    else if (keyPressed === 's' || keyPressed === 'ArrowRight') choice = 'scissors';
    if (choice !== '') {
        main(choice);
        const option = document.querySelector(`.js-${choice}`);
        option.classList.add('opt-button-highlight');
        setTimeout(function () {option.classList.remove('opt-button-highlight')}, 100);
    }
}

document.querySelectorAll('.opt-button').forEach(element => {
    element.addEventListener('click', (event) => {
        element.classList.add('opt-button-highlight-auto');
        setTimeout(() => element.classList.remove('opt-button-highlight-auto'), 100);
    })
});

function generateMove() {
    const x = Math.random();
    if (x <= 1/3) {
        return "rock";
    } else if (x <= 2/3) {
        return "paper";
    } else {
        return "scissors";
    }
}

function getResult(userMove, computerMove = generateMove()) {
    let result = '';
    if (computerMove === userMove) result = "tie";
    else if (computerMove === "rock") {
        if (userMove === "paper") result = "win";
        else result = "lose";
    } else if (computerMove === "paper") {
        if (userMove === "rock") result = "lose";
        else result = "win";
    } else {
        if (userMove === "rock") result = "win";
        else result = "lose";
    }
    return result;
}

function getScore() {
    const score = JSON.parse(localStorage.getItem("score"));
    if (!score) return reset();
    else return score;
}

function setScore(score) {
    localStorage.setItem("score", JSON.stringify(score));
}

function publishResult(result) {
    const resultElement = document.querySelector('.js-result');
    resultElement.innerHTML = `${messages[result]}`;
}

function publishTrial(userMove, computerMove) {
    const userMoveImage = images[userMove], computerMoveImage = images[computerMove];
    const trialElement = document.querySelector('.js-trial');
    trialElement.innerHTML = `You ${userMoveImage} ${computerMoveImage} Computer`;
}

function publishStats(score = getScore()) {
    const wins = score.win, losses = score.lose, ties = score.tie;
    const statsElement = document.querySelector('.js-stats');
    statsElement.innerHTML = `Wins: ${wins}, Losses: ${losses}, Ties: ${ties}.`;
}

function publish(userMove, computerMove, result) {
    publishResult(result);
    publishTrial(userMove, computerMove);
    publishStats();
}

function reset() {
    const resetButton = document.querySelector('.js-reset-button');
    resetButton.innerText = 'Reset!';
    resetButton.classList.add('reset');
    setTimeout(() => {
        resetButton.innerText = 'Reset Score';
        resetButton.classList.remove('reset');
    }, 1000);
    const newScore = {
        win : 0,
        lose : 0,
        tie: 0
    };
    setScore(newScore);
    publishStats();
    return newScore;
}

const main = function (userMove = generateMove()) {
    const computerMove = generateMove();
    const result = getResult(userMove, computerMove);
    let score = getScore();

    score[result]++;
    setScore(score);
    publish(userMove, computerMove, result);
}

const autoplayButtonInit = () => {
    playing = false;
    interval = 0;
    const autoplayButton = document.querySelector('.js-autoplay');
    autoplayButton.addEventListener('click', () => {
        if (!playing) {
            interval = autoplay();
            autoplayButton.innerText = 'Stop';
            autoplayButton.classList.add('reset');
        }
        else {
            autoplayButton.innerText = 'Auto Play';
            autoplayButton.classList.remove('reset');
            clearInterval(interval);
        }
        playing = !playing;
        function autoplay() {
            return setInterval(() => {
                // main(userMove);
                userMove = generateMove();
                document.querySelector(`.js-${userMove}`).click();
            }, 100);
        }
    });
}

autoplayButtonInit();
publishStats();