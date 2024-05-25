document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const languageSelect = document.getElementById('language-select');
    const speakButton = document.getElementById('speak-button');
    const downloadButton = document.getElementById('download-button');

    // Populate language options
    const synth = window.speechSynthesis;
    let voices = [];

    const populateVoices = () => {
        voices = synth.getVoices();
        languageSelect.innerHTML = voices.map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`).join('');
    };

    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
    }

    // Speak the text
    speakButton.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoice = voices.find(voice => voice.name === languageSelect.value);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        synth.speak(utterance);
    });

    // Download the speech as an audio file
    downloadButton.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(textInput.value);
        const selectedVoice = voices.find(voice => voice.name === languageSelect.value);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(destination.stream);

        const audioChunks = [];
        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' }); // Changed type to MPEG
            const audioUrl = URL.createObjectURL(audioBlob);
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = 'speech.mp3'; // Changed filename to .mp3
            link.click();
        };

        synth.speak(utterance);

        // Start and stop recording
        mediaRecorder.start();
        setTimeout(() => {
            mediaRecorder.stop();
        }, 2000); // Recording for 2 seconds to ensure complete speech capture
    });
});
