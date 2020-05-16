const pitch = document.querySelector('#pitch');
const speed = document.querySelector('#speed');
const voice = document.querySelector('#voice');
const submit = document.querySelector('#submit');
const text = document.querySelector('#text');
const pitch_badge = document.querySelector('#pitch-badge');
const speed_badge = document.querySelector('#speed-badge');
var background_img = document.querySelector('.container-fluid');
var check_status = 1;
let synth = window.speechSynthesis;
let voices = [];
synth.onvoiceschanged = () => {
    if (check_status) {
        voices = synth.getVoices();
        voices.forEach((voice_name) => {
            const option = document.createElement('option');
            if (voice_name.name === 'Google US English') {
                option.selected = true;
            }
            option.setAttribute('data-name', voice_name.name);
            option.setAttribute('data-lang', voice_name.lang);
            option.textContent =
                voice_name.name + ' ( ' + voice_name.lang + ' ) ';
            voice.appendChild(option);
            check_status = 0;
        });
    }
};

pitch.onchange = () => {
    pitch_badge.innerText = pitch.value;
};
speed.onchange = () => {
    speed_badge.innerText = speed.value;
};

submit.onclick = (event) => {
    event.preventDefault();
    if (text.value === '') {
        text.classList.add('is-invalid');
    } else {
        submit.disabled = true;
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
        var spinner = document.createElement('span');
        var form_group = document.querySelector('.form-group');
        spinner.setAttribute('class', 'spinner-border text-light spinner');
        form_group.appendChild(spinner);
        text.disabled = true;
        speak.pitch = pitch.value;
        speak.rate = speed.value;
        speak.onstart = () => {
            background_img.style.background = 'url(./background.gif)';
            form_group.removeChild(spinner);
        };
        synth.cancel();
        synth.speak(speak);
        speak.onend = () => {
            background_img.style.background = '';
            submit.disabled = false;
            text.disabled = false;
        };
        synth.onerror = (error) => {
            alert(
                `Sorry, an error occured due to : ${error.message} please reload the page to restart`
            );
        };
    }
};
