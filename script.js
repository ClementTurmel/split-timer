const alarmSound = new Audio("alarm.mp3"); // Replace "alarm.mp3" with the path to your MP3 file


document.getElementById("timer-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  // Dynamically retrieve all timer inputs and spans
  const timerInputs = Array.from(document.querySelectorAll("input[type='number']"));
  const timerSpans = timerInputs.map(input => 
      document.getElementById(`${input.id}-time-elapsed`)
  );

  function startTimer(index) {
      if (index >= timerInputs.length) {
          alert("All timers have finished!");
          return;
      }

      const minutesInput = timerInputs[index];
      const timeElapsedSpan = timerSpans[index];

      let remainingTime = parseInt(minutesInput.value) * 60; // Convert minutes to seconds

      if (isNaN(remainingTime) || remainingTime <= 0) {
          alert(`Please enter a valid number of minutes for Timer ${index + 1}.`);
          startTimer(index + 1); // Skip to the next timer
          return;
      }

      const timerInterval = setInterval(() => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;

          // Update the display
          timeElapsedSpan.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

          if (remainingTime <= 0) {
              clearInterval(timerInterval); // Stop the timer
              alarmSound.play(); 
              startTimer(index + 1); // Start the next timer
          }

          remainingTime--;
      }, 1000);
  }

  startTimer(0); // Start the first timer
});