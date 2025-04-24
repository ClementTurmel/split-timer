const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;

/**
 * Plays blank sounds followed by alarm sounds for each interval in the array.
 * @param {number[]} intervals - Array of intervals in seconds.
 * @param {string} alarmUrl - The URL or path to the alarm.mp3 file.
 */
async function playBlankAndAlarmSound(intervals, alarmUrl) {
    const sampleRate = 46000; // Standard sample rate for audio

    // Fetch and decode the alarm sound
    const response = await fetch(alarmUrl);
    const alarmArrayBuffer = await response.arrayBuffer();
    const alarmBuffer = await audioContext.decodeAudioData(alarmArrayBuffer);
    const alarmChannelData = alarmBuffer.getChannelData(0);

    console.log("Alarm buffer duration in seconds:", alarmBuffer.duration);

    // Calculate total samples for all intervals and alarms
    let totalSamples = 0;
    const blankBuffers = [];
    intervals.forEach(interval => {
        const blankSamples = sampleRate * interval;
        totalSamples += blankSamples + alarmBuffer.length;
        

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

        concatenatedBuffer.copyToChannel(alarmChannelData, 0, offset);
        offset += alarmBuffer.length;
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
    playBlankAndAlarmSound([1, 10, 15], "alarm.mp3");
});