async function submitForm(event) {
    event.preventDefault()
    const form = document.querySelector('#form')
    const formData = new FormData(form);
    const res = await fetch('/upload', {
        method: "POST",
        body: formData
    });
    const { labels } = await res.json();
    document.querySelector('#labels').innerHTML = labels
    let msg = new SpeechSynthesisUtterance();
    for (const label of labels) {
        await pronounce(label)
    }
    return

}

async function pronounce(word) {
    const audio = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(audio);

    return new Promise(resolve => {
        audio.onend = resolve;
    });
}


document.querySelector('#form').addEventListener('submit', submitForm)