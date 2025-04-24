const alarmSound = new Audio("alarm.mp3");
alarmSound.preload = "auto"; // Preload the audio file

document.getElementById("timer-form").addEventListener("submit", function (event) {
    alarmSound.play().catch(() => {
      console.log("Audio playback unlocked after user interaction.");
    }); // Play the sound to unlock it after user interaction

    event.preventDefault(); // Prevent form submission

    // Dynamically retrieve all timer inputs and spans
    const timerInputs = Array.from(document.querySelectorAll("input[type='number']"));
    const timerSpans = timerInputs.map(input =>
        document.getElementById(`${input.id}-time-elapsed`)
    );

    let timers = []; // Array to store timer data

    // Initialize timers
    timerInputs.forEach((input, index) => {
        const duration = parseInt(input.value) * 60; // Convert minutes to seconds
        if (!isNaN(duration) && duration > 0) {
            timers.push({
                index,
                duration,
            });
        }
    });

    function startNextTimer(index) {
        if (index >= timers.length) {
            alert("All timers have finished!");
            return;
        }

        const timer = timers[index];
        const endTime = Date.now() + timer.duration * 1000;

        function updateTimer() {
            const now = Date.now();
            const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;

            // Update the display
            timerSpans[timer.index].textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

            if (remainingTime === 0) {
                alarmSound.play(); // Play the alarm sound
                startNextTimer(index + 1); // Start the next timer
            } else {
                requestAnimationFrame(updateTimer); // Schedule the next update
            }
        }

        updateTimer(); // Start updating the current timer
    }

    // Start the first timer
    if (timers.length > 0) {
        startNextTimer(0);
    }
});