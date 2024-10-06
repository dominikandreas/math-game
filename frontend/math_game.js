// math_game.js
export function initializeMathGame(elements) {
    let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    let currentScore = parseInt(localStorage.getItem('currentScore')) || 0;
    let currentQuestion = {};

    const generateQuestion = () => {
        const num1 = getRandomInt(1, 10 * currentLevel);
        const num2 = getRandomInt(1, 10 * currentLevel);
        currentQuestion = {
            num1,
            num2,
            answer: num1 + num2
        };
        elements.questionElement.textContent = `What is ${num1} + ${num2}?`;
        localStorage.setItem('currentQuestion', JSON.stringify(currentQuestion));
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const updateScore = (isCorrect) => {
        if (isCorrect) {
            currentScore += 10;
            if (currentScore % 50 === 0) {
                currentLevel++;
            }
        } else {
            currentScore = Math.max(0, currentScore - 5);
        }
        localStorage.setItem('currentLevel', currentLevel);
        localStorage.setItem('currentScore', currentScore);
        elements.levelElement.textContent = currentLevel;
        elements.scoreElement.textContent = currentScore;
    };

    const handleAnswerSubmission = () => {
        const userAnswer = elements.answerInput.value.trim();
        if (currentQuestion.num1 !== undefined && isNaN(parseInt(userAnswer, 10))) {
            alert("Please enter a valid number.");
            return;
        }

        const isCorrect = parseInt(userAnswer, 10) === currentQuestion.answer;
        updateScore(isCorrect);
        saveResult(elements.userName.value, currentLevel, currentScore);
        elements.answerInput.value = "";
        generateQuestion();
    };

    const saveResult = async (deviceId, level, score) => {
        if (!deviceId) {
            alert("Please enter a Device ID to save your progress.");
            return;
        }

        try {
            const response = await fetch("/save_result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ device_id: deviceId, level, score }),
            });
            if (!response.ok) {
                throw new Error("Failed to save result");
            }
            const data = await response.json();
            console.log("Result saved: ", data);
        } catch (error) {
            console.error("Error saving result: ", error);
        }
    };

    elements.submitAnswerButton.addEventListener("click", handleAnswerSubmission);
    
    const savedQuestion = localStorage.getItem('currentQuestion');
    if (savedQuestion) {
        currentQuestion = JSON.parse(savedQuestion);
        elements.questionElement.textContent = `What is ${currentQuestion.num1} + ${currentQuestion.num2}?`;
    } else {
        generateQuestion();
    }
    elements.levelElement.textContent = currentLevel;
    elements.scoreElement.textContent = currentScore;
}
