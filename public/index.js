async function submitForm(event){
    event.preventDefault()
    const form = document.querySelector('#form')
    const formData = new FormData(form);
    const res = await fetch('/upload', {
        method: "POST",
        body: formData
    });
    const {labels} = await res.json();
    console.log(labels)
    document.querySelector('#labels').innerHTML = labels
    const msg = new SpeechSynthesisUtterance();
    for (const label of labels) {
        msg.text = label
        window.speechSynthesis.speak(msg)
    }
    return

}

document.querySelector('#form').addEventListener('submit', submitForm)