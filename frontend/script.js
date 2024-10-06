document.addEventListener("DOMContentLoaded", function () {
    const deviceIdInput = document.getElementById("device-id");
    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitAnswerButton = document.getElementById("submit-answer");
    const levelElement = document.getElementById("level");
    const scoreElement = document.getElementById("score");
    const exportResultsButton = document.getElementById("export-results");

    let currentLevel = 1;
    let currentScore = 0;
    let currentQuestion = {};

    function generateQuestion() {
        const num1 = Math.floor(Math.random() * 10 * currentLevel) + 1;
        const num2 = Math.floor(Math.random() * 10 * currentLevel) + 1;
        currentQuestion = {
            num1,
            num2,
            answer: num1 + num2
        };
        questionElement.textContent = `What is ${num1} + ${num2}?`;
    }

    function updateScore(isCorrect) {
        if (isCorrect) {
            currentScore += 10;
            if (currentScore % 50 === 0) {
                currentLevel++;
            }
        } else {
            currentScore = Math.max(0, currentScore - 5);
        }
        levelElement.textContent = currentLevel;
        scoreElement.textContent = currentScore;
    }

    submitAnswerButton.addEventListener("click", function () {
        const userAnswer = parseInt(answerInput.value, 10);
        if (userAnswer === currentQuestion.answer) {
            updateScore(true);
            saveResult(deviceIdInput.value, currentLevel, currentScore);
        } else {
            updateScore(false);
        }
        answerInput.value = "";
        generateQuestion();
    });

    function saveResult(deviceId, level, score) {
        fetch("/save_result", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ device_id: deviceId, level, score })
        })
        .then(response => response.json())
        .then(data => console.log("Result saved: ", data))
        .catch(error => console.error("Error saving result: ", error));
    }

    exportResultsButton.addEventListener("click", function () {
        const deviceId = deviceIdInput.value;
        if (deviceId) {
            window.location.href = `/export_results/${deviceId}`;
        } else {
            alert("Please enter a Device ID to export results.");
        }
    });

    generateQuestion();
});