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
        const recorder = new MediaRecorder(destination.stream);

        synth.speak(utterance);

        const audioChunks = [];
        recorder.ondataavailable = event => audioChunks.push(event.data);
        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = 'speech.wav';
            link.click();
        };

        utterance.onstart = () => recorder.start();
        utterance.onend = () => recorder.stop();
    });
});
