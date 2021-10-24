const spinner = `
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
`

const playing = '<i class="bi bi-play-fill"></i>'

const statusSymbol = document.querySelector('#statusSymbol')

document.querySelector('#uploadButton').addEventListener('click', () => {
    document.querySelector('#uploadFile').click()
})

document.querySelector('#uploadFile').addEventListener('change', () => {
    document.querySelector('#submitForm').click();
})


async function submitForm(event) {
    event.preventDefault();
    document.querySelector('#uploadButton').disabled = true;
    statusSymbol.innerHTML = spinner;
    const form = document.querySelector('#form');
    const formData = new FormData(form);
    const res = await fetch('/upload', {
        method: "POST",
        body: formData
    });    
    const { labels } = await res.json();
    statusSymbol.innerHTML = playing;
    document.querySelector('#message').style.display = 'none'    
    for (const label of labels) {
        document.querySelector('#wordsPronouncing').textContent = label
        await pronounce(label);
    }
    document.querySelector('#wordsPronouncing').textContent = ''
    document.querySelector('#message').style.display = '' 
    statusSymbol.innerHTML = '';
    document.querySelector('#uploadButton').disabled = false;
    return;
}

async function pronounce(word) {
    const audio = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(audio);

    return new Promise(resolve => {
        audio.onend = resolve;
    });
}


document.querySelector('#form').addEventListener('submit', submitForm);