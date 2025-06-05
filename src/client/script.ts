const form = document.querySelector<HTMLFormElement>('#dodawanie')
// const button = document.querySelector('button#siema') as HTMLButtonElement // ? TO TUTAJ USTALA ZE TO JEST HTMLBUTTONELEMENT A NIE TAK JAK LINIJKA WYZEJ HTMLBUTTONELEMENT | NULL WIEC GORSZE
//? button?.przykladowaMetoda() JEZELI BUTTON ISTNIEJE (nie jest NULL), WYWOŁA METODE.
form?.addEventListener('submit', (e) => {
    e.preventDefault()
    if(!document.querySelector<HTMLInputElement>("#uploadImage")?.files?.length) {
        alert("CHOOSE AN IMAGE FILE.")
        return
    }
    //? uzywam formData bo korzystam z plikow.
    const formData = new FormData(form)
    console.log(formData);
    formData.forEach((value, key) => {
        console.log(key, value)
    })
    fetch('http://localhost:4747/movies/add', {
        method: "POST",
        //? content-type ustawia sie sam pod formData
        body: formData
    })
    //? szyk ze najpierw definiuje sie repsonse a potem wyswietla dane jest odgórny, jakbym usunal czesc z response to by w data pojawil sie response
    .then((response: Response) => { //? tutaj response definiuje w jakiej postaci ma być czyli jakby zwracalo json to by bylo .json() w returnie
        console.log("repsonse status: " + response.status);
        return response.text()
    })
    .then((data: string) => { //? przyslane z serwera
        console.log(data)
    })
    .then(() => {
        form.reset()
    })
    .catch((err: Error) => console.log(err))
})