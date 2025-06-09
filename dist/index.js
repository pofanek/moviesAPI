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
    imageElement.alt = fileName;
    descriptionElement.textContent = description;
}
const fileInput = document.querySelector("#uploadImage");
fileInput === null || fileInput === void 0 ? void 0 : fileInput.addEventListener('change', () => {
    if (!fileInput.files) {
        return;
    }
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    document.querySelector('#preview').src = url;
});
form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
    var _a, _b;
    e.preventDefault();
    if (!((_b = (_a = document.querySelector("#uploadImage")) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b.length)) {
        alert("CHOOSE AN IMAGE FILE.");
        return;
    }
    //? uzywam formData bo korzystam z plikow.
    const formData = new FormData(form);
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
        return response.json();
    })
        .then((data) => {
        console.log(data);
    })
        .then(() => {
        form.reset();
        const img = document.querySelector('#preview');
        if (!img) {
            return;
        }
        img.src = "";
    })
        .catch((err) => console.log(err));
});
const formSearch = document.querySelector('#wyszukiwanie');
const searchInput = document.querySelector('input[name=search]');
formSearch === null || formSearch === void 0 ? void 0 : formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(`http://localhost:4747/movies/search?query=${encodeURIComponent(searchInput.value)}`) //? encodeURIComponent - formatuje na jeden ciag znakow zamieniajac spacje itd np. // "cze%C5%9B%C4%87%20%C5%9Bwiat%3F"
        .then(res => {
        return res.json();
    }).then(data => {
        const result = data.result;
        if (!result) {
            console.error("movie not found.");
            console.warn(data);
            return;
        }
        console.log(result);
        showMovieInfo(result.name, result.description, result.imagePath);
    }).finally(() => console.log("fetch finished"));
});
