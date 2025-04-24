const alarmSound = new Audio("alarm.mp3"); // Remplacez "alarm.mp3" par le chemin de votre fichier MP3

document.getElementById("timer-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    // Récupère dynamiquement tous les inputs et spans
    const timerInputs = Array.from(document.querySelectorAll("input[type='number']"));
    const timerSpans = timerInputs.map(input =>
        document.getElementById(`${input.id}-time-elapsed`)
    );

    let currentTimerIndex = 0;

    // Fonction pour démarrer un minuteur avec un Web Worker
    function startTimer(index) {
        if (index >= timerInputs.length) {
            alert("Tous les minuteurs sont terminés !");
            return;
        }

        const minutesInput = timerInputs[index];
        const timeElapsedSpan = timerSpans[index];
        const duration = parseInt(minutesInput.value) * 60; // Convertit les minutes en secondes

        if (isNaN(duration) || duration <= 0) {
            alert(`Veuillez entrer un nombre valide de minutes pour le minuteur ${index + 1}.`);
            startTimer(index + 1); // Passe au minuteur suivant
            return;
        }

        // Crée un Web Worker
        workerUrl = "https://raw.githubusercontent.com/ClementTurmel/split-timer/refs/heads/main/timeWorker.js";
        const worker = new Worker(workerUrl);

        // Envoie les données au Web Worker
        worker.postMessage({ timerIndex: index, duration });

        // Écoute les messages du Web Worker
        worker.onmessage = function (event) {
            const { timerIndex, remainingTime, finished } = event.data;

            if (remainingTime >= 0) {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;

                // Met à jour l'affichage
                timeElapsedSpan.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            }

            if (finished) {
                worker.terminate(); // Arrête le Web Worker
                alarmSound.play(); // Joue le son d'alarme
                alert(`Le minuteur ${timerIndex + 1} est terminé !`);
                startTimer(timerIndex + 1); // Passe au minuteur suivant
            }
        };
    }

    startTimer(0); // Démarre le premier minuteur
});