const form = document.querySelector<HTMLFormElement>('#dodawanie')
// const button = document.querySelector('button#siema') as HTMLButtonElement // ? TO TUTAJ USTALA ZE TO JEST HTMLBUTTONELEMENT A NIE TAK JAK LINIJKA WYZEJ HTMLBUTTONELEMENT | NULL WIEC GORSZE
//? button?.przykladowaMetoda() JEZELI BUTTON ISTNIEJE (nie jest NULL), WYWOŁA METODE.
function showMovieInfo(name: string, description: string, imagePath: string) {
    const nameElement = document.querySelector<HTMLParagraphElement>('#name')
    const imageElement = document.querySelector<HTMLImageElement>('#obrazek')
    const descriptionElement = document.querySelector<HTMLParagraphElement>('#description')
    nameElement!.textContent = name.toUpperCase()
    imageElement!.src = imagePath
    const fileName = imagePath.split(/[/\\]/).pop()?.split('.')[0] ?? ''
    imageElement!.alt = fileName
    descriptionElement!.textContent = description
}
type MovieData = {
    name: string
    description: string
    imagePath: string
}
const fileInput = document.querySelector<HTMLInputElement>("#uploadImage")
fileInput?.addEventListener('change', () => {
    if (!fileInput.files){return}
    const file = fileInput.files[0]
    const url = URL.createObjectURL(file);
    document.querySelector<HTMLImageElement>('#preview')!.src = url;
})
form?.addEventListener('submit', (e) => {
    e.preventDefault()
    if(!document.querySelector<HTMLInputElement>("#uploadImage")?.files?.length) {
        alert("CHOOSE AN IMAGE FILE.")
        return
    }
    //? uzywam formData bo korzystam z plikow.
    const formData = new FormData(form)
    formData.forEach((value, key) => {
        console.log(key, value)
    })
    fetch('http://localhost:4747/movies/add', {
        method: "POST",
        //? content-type ustawia sie sam pod formData
        body: formData
    })
    //? szyk ze najpierw definiuje sie repsonse a potem wyswietla dane jest odgórny, jakbym usunal czesc z response to by w data pojawil sie response
    .then((response: Response) => { //? tutaj response definiuje w jakiej postaci ma być czyli jakby zwracalo text to by bylo .text() w returnie
        console.log("repsonse status: " + response.status);
        return response.json()
    })
    .then((data) => { //? przyslane z serwera
        console.log(data)
    })
    .then(() => {
        form.reset()
        const img = document.querySelector<HTMLImageElement>('#preview')
        if (!img) {return}
        img.src = ""
    })
    .catch((err: Error) => console.log(err))
})
const formSearch = document.querySelector<HTMLFormElement>('#wyszukiwanie')
const searchInput = document.querySelector<HTMLInputElement>('input[name=search]')!

formSearch?.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`http://localhost:4747/movies/search?query=${encodeURIComponent(searchInput.value)}`) //? encodeURIComponent - formatuje na jeden ciag znakow zamieniajac spacje itd np. // "cze%C5%9B%C4%87%20%C5%9Bwiat%3F"
    .then(res => {
        return res.json()
    }).then(data => {
        const result = data.result;
        if(!result){
            console.error("movie not found.")
            console.warn(data)
            return
        }
        console.log(result)
        showMovieInfo(result.name, result.description, result.imagePath)
    }).finally(()=>console.log("fetch finished"))
})