const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;

fetch("alarm.mp3")
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        audioBuffer = buffer;
    });

function playAlarmSound() {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

document.getElementById("timer-form").addEventListener("submit", function (event) {
    fetch("alarm.mp3")
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        audioBuffer = buffer;
    });

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
                //alarmSound.play(); // Play the alarm sound
                playAlarmSound(); // Play the alarm sound
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