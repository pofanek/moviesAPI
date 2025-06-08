"use strict";
const form = document.querySelector('#dodawanie');
// const button = document.querySelector('button#siema') as HTMLButtonElement // ? TO TUTAJ USTALA ZE TO JEST HTMLBUTTONELEMENT A NIE TAK JAK LINIJKA WYZEJ HTMLBUTTONELEMENT | NULL WIEC GORSZE
//? button?.przykladowaMetoda() JEZELI BUTTON ISTNIEJE (nie jest NULL), WYWOŁA METODE.
function showMovieInfo(name, description, imagePath) {
    var _a, _b;
    const nameElement = document.querySelector('#name');
    const imageElement = document.querySelector('#obrazek');
    const descriptionElement = document.querySelector('#description');
    nameElement.textContent = name.toUpperCase();
    imageElement.src = imagePath;
    const fileName = (_b = (_a = imagePath.split(/[/\\]/).pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0]) !== null && _b !== void 0 ? _b : '';
    console.log("nazwa PLIKU: " + fileName);
    imageElement.alt = fileName;
    descriptionElement.textContent = description;
}
form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
    var _a, _b;
    e.preventDefault();
    if (!((_b = (_a = document.querySelector("#uploadImage")) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length)) {
        alert("CHOOSE AN IMAGE FILE.");
        return;
    }
    //? uzywam formData bo korzystam z plikow.
    const formData = new FormData(form);
    console.log(formData);
    formData.forEach((value, key) => {
        console.log(key, value);
    });
    fetch('http://localhost:4747/movies/add', {
        method: "POST",
        //? content-type ustawia sie sam pod formData
        body: formData
    })
        //? szyk ze najpierw definiuje sie repsonse a potem wyswietla dane jest odgórny, jakbym usunal czesc z response to by w data pojawil sie response
        .then((response) => {
        console.log("repsonse status: " + response.status);
        return response.text();
    })
        .then((data) => {
        console.log(data);
    })
        .then(() => {
        form.reset();
    })
        .catch((err) => console.log(err));
});
const formSearch = document.querySelector('#wyszukiwanie');
const searchInput = document.querySelector('input[name=search]');
formSearch === null || formSearch === void 0 ? void 0 : formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(`http://localhost:4747/movies/search?query=${encodeURIComponent(searchInput.value)}`) //? encodeURIComponent - formatuje na jeden ciag znakow zamieniajac spacje itd np. // "cze%C5%9B%C4%87%20%C5%9Bwiat%3F"
        .then(res => {
        return res.text();
    }).then(data => {
        console.log(data);
        const obj = JSON.parse(data);
        showMovieInfo(obj.name, obj.description, obj.imagePath);
    });
    console.log("fetch finished");
});
