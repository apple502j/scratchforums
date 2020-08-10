const preference = document.getElementById('preference');
const button = document.getElementById('change');

const fetchConfig = () => window.localStorage.getItem('useScratchURL') === 'true';

const renderPreference = () => {
    if (fetchConfig()) {
        preference.innerText = 'Scratch Website URL';
        button.innerText = 'Use scratchforums URL';
    } else {
        preference.innerText = 'scratchforums URL';
        button.innerText = 'Use Scratch Website URL';
    }
};

const changeConfig = () => {
    window.localStorage.setItem('useScratchURL', !fetchConfig());
    renderPreference();
};

renderPreference();
button.addEventListener('click', changeConfig);
