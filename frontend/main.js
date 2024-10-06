// main.js
import { initializeGeneralKnowledgeGame } from './general_knowledge_game.js';
import { initializeMathGame } from './math_game.js';

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        userName: document.getElementById("user-name"),
        questionElement: document.getElementById("question"),
        answerInput: document.getElementById("answer"),
        submitAnswerButton: document.getElementById("submit-answer"),
        levelElement: document.getElementById("level"),
        scoreElement: document.getElementById("score"),
        exportResultsButton: document.getElementById("export-results"),
    };

    // Add event listeners for different games
    document.getElementById("math-game-button").addEventListener("click", () => {
        initializeMathGame(elements);
    });

    document.getElementById("general-knowledge-game-button").addEventListener("click", () => {
        initializeGeneralKnowledgeGame(elements);
    });

    elements.exportResultsButton.addEventListener("click", () => {
        const deviceId = elements.userName.value;
        if (deviceId) {
            window.location.href = `/export_results/${deviceId}`;
        } else {
            alert("Please enter your name to export results.");
        }
    });
});