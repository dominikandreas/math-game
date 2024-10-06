export function initializeGeneralKnowledgeGame(elements) {
    let currentLevel = 1;
    let currentScore = 0;
    let currentQuestion = {};

    const questions = [
        { question: "What is the capital of France?", answer: "Paris" },
        { question: "Who wrote 'Hamlet'?", answer: "Shakespeare" },
        { question: "What is the largest planet in our solar system?", answer: "Jupiter" },
    ];

    const generateQuestion = () => {
        const randomIndex = getRandomInt(0, questions.length - 1);
        currentQuestion = questions[randomIndex];
        elements.questionElement.textContent = currentQuestion.question;
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
        elements.levelElement.textContent = currentLevel;
        elements.scoreElement.textContent = currentScore;
    };

    const handleAnswerSubmission = () => {
        const userAnswer = elements.answerInput.value.trim().toLowerCase();
        if (!userAnswer) {
            alert("Please enter an answer.");
            return;
        }

        const isCorrect = userAnswer === currentQuestion.answer.toLowerCase();
        updateScore(isCorrect);
        saveResult(elements.deviceIdInput.value, currentLevel, currentScore);
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
    generateQuestion();
}
