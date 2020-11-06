const pitch = document.querySelector('#pitch');
const speed = document.querySelector('#speed');
const voice = document.querySelector('#voice');
const submit = document.querySelector('#submit');
const text = document.querySelector('#text');
const pitch_badge = document.querySelector('#pitch-badge');
const speed_badge = document.querySelector('#speed-badge');
const unsupportedBrowser = document.getElementsByClassName('unsupported')[0];
const spinner = document.getElementsByClassName('spinner')[0];
var background_img = document.querySelector('.container-fluid');
let synth = window.speechSynthesis;
let voices = [];

var isFirefox = typeof InstallTrigger !== 'undefined';
var isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
        return p.toString() === '[object SafariRemoteNotification]';
    })(
        !window['safari'] ||
            (typeof safari !== 'undefined' && safari.pushNotification)
    );

const getVoices = () => {
    voices = synth.getVoices();
    voices.forEach((voice_name) => {
        const option = document.createElement('option');
        if (voice_name.name === 'Google US English') {
            option.selected = true;
        }
        option.setAttribute('data-name', voice_name.name);
        option.setAttribute('data-lang', voice_name.lang);
        option.textContent = voice_name.name + ' ( ' + voice_name.lang + ' ) ';
        voice.appendChild(option);
    });
};

pitch.onmousemove = () => {
    pitch_badge.innerText = pitch.value;
};
speed.onmousemove = () => {
    speed_badge.innerText = speed.value;
};

let speak = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (text.value === '') {
        text.classList.add('is-invalid');
    } else {
        submit.disabled = true;
        text.blur();
        if (text.classList.contains('is-invalid')) {
            text.classList.remove('is-invalid');
            text.classList.add('is-valid');
        }
        var speak = new SpeechSynthesisUtterance(text.value);
        const selected_voice = voice.selectedOptions[0].getAttribute(
            'data-name'
        );
        voices.forEach((item) => {
            if (item.name === selected_voice) {
                speak.voice = item;
            }
        });
        spinner.classList.remove('hidden');
        text.disabled = true;
        speak.pitch = pitch.value;
        speak.rate = speed.value;
        speak.onstart = () => {
            background_img.style.background = 'url(./background.gif)';
            spinner.classList.add('hidden');
        };
        synth.cancel();
        synth.speak(speak);
        speak.onend = () => {
            background_img.style.background = '';
            submit.disabled = false;
            text.disabled = false;
        };
        synth.onerror = (error) => {
            console.error(
                `Sorry, an error occured due to : ${error.message} please reload the page to restart`
            );
        };
    }
};

if (isChrome || isFirefox) {
    synth.onvoiceschanged = () => {
        getVoices();
    };
    submit.addEventListener('click', speak);
} else if (isSafari) {
    getVoices();
    submit.addEventListener('click', speak);
} else {
    unsupportedBrowser.classList.remove('hidden');
    text.disabled = true;
    submit.disabled = true;
}
