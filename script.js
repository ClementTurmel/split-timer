const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;


async function fetchAndDecodeAudio(url) {
  var sound = {
    response: null,
    arrayBuffer: null,
    buffer: null,
    channelData: null
  };

  sound.response = await fetch(url);
  sound.arrayBuffer = await sound.response.arrayBuffer();
  sound.buffer = await audioContext.decodeAudioData(sound.arrayBuffer);
  sound.channelData = sound.buffer.getChannelData(0);

  return sound;
}

async function playBlankAndAlarmSound(intervals, alarmUrl, endingUrl) {
    const sampleRate = 46000; // Standard sample rate for audio

    var alarmSound = await fetchAndDecodeAudio(alarmUrl);
    var endingSound = await fetchAndDecodeAudio(endingUrl);


    console.log("Alarm buffer duration in seconds:", alarmSound.buffer.duration);

    // Calculate total samples for all intervals and alarms
    let totalSamples = 0;
    const blankBuffers = [];
    intervals.forEach(interval => {
        var sound = alarmSound;
        //if last interval, add ending sound
        if (interval === intervals[intervals.length - 1]) {
          sound = endingSound;
        }

        const blankSamples = sampleRate * interval;
        totalSamples += blankSamples + sound.buffer.length;
        

        // Create blank sound for the interval
        const blankBuffer = audioContext.createBuffer(1, blankSamples, sampleRate);
        const blankChannelData = blankBuffer.getChannelData(0);
        blankChannelData.fill(0); // Fill with silence
        blankBuffers.push(blankBuffer);
    });

    // Create a new buffer to concatenate all blank and alarm sounds
    const concatenatedBuffer = audioContext.createBuffer(1, totalSamples, sampleRate);
    let offset = 0;

    // Copy blank and alarm sounds into the concatenated buffer
    blankBuffers.forEach(blankBuffer => {
        const blankChannelData = blankBuffer.getChannelData(0);
        concatenatedBuffer.copyToChannel(blankChannelData, 0, offset);
        offset += blankBuffer.length;

        //if last interval, add ending sound
        if (blankBuffer === blankBuffers[blankBuffers.length - 1]) {
          concatenatedBuffer.copyToChannel(endingSound.channelData, 0, offset);
          offset += endingSound.buffer.length;
        } else {
          concatenatedBuffer.copyToChannel(alarmSound.channelData, 0, offset);
          offset += alarmSound.buffer.length;
        }
    });

    // Play the concatenated sound
    const source = audioContext.createBufferSource();
    source.buffer = concatenatedBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Example usage: Play blank and alarm sounds for intervals of 5, 10, and 15 seconds
document.getElementById("timer-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    const intervals = [];
    const inputs = document.querySelectorAll("#timer-form input[type='number']");
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            intervals.push(value * 60); // Convert minutes to seconds
        }
    });


    playBlankAndAlarmSound(intervals, "alarm.mp3", "fanfare.mp3");
});