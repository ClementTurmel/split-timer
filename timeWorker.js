self.onmessage = function (event) {
  const { timerIndex, duration } = event.data; // Récupère l'index et la durée du minuteur
  let remainingTime = duration;

  const timerInterval = setInterval(() => {
      remainingTime--;

      // Envoyer le temps restant au thread principal
      self.postMessage({ timerIndex, remainingTime });

      if (remainingTime <= 0) {
          clearInterval(timerInterval);
          self.postMessage({ timerIndex, remainingTime: 0, finished: true }); // Indique que le minuteur est terminé
      }
  }, 1000);
};