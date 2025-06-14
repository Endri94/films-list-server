

// Находим элементы формы и кнопки
const filmForm = document.querySelector("#film-form");
const title = document.querySelector("#title");
const genre = document.querySelector("#genre");
const releaseYear = document.querySelector("#releaseYear");
const isWatched = document.querySelector("#isWatched");
const submitBtn = document.querySelector("#submitButton");
// находим блоки инпутов для появления текста ошибки
const nameBlock = document.querySelector(".name-block");
const genreBlock = document.querySelector(".genre-block");
const releaseBlock = document.querySelector(".release-block");
// создаем ошибку под полями ввода
const titleErrorMessage = document.createElement("span");
const genreErrorMessage = document.createElement("span");
const releaseErrorMessage = document.createElement("span");
// добавляем класс к текстам ошибки
titleErrorMessage.classList.add("error-message");
genreErrorMessage.classList.add("error-message");
releaseErrorMessage.classList.add("error-message");
// отображение текущего года для валидации ввода года
const currentDate = new Date().getFullYear();

// находим форму фильтрации и поля
const filterForm = document.querySelector('#filter-form');
const filterInputTitle = document.querySelector('#filter-input__title')
const filterInputGenre = document.querySelector('#filter-input__genre')
const filterInputReleaseYear = document.querySelector('#filter-input__releaseYear')
const filterSelect = document.querySelector('#filter-select')

// функция присвоения значений из полей формы к объекту (film)
function handleFormSubmit() {
    const filmData = {
        title: title.value.trim(),
        genre: genre.value.trim(),
        releaseYear: releaseYear.value,
        isWatched: isWatched.checked
    };
    addFilm(filmData);
}

// корректный ввод в поле инпут
title.addEventListener('input', function (e) {
    this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
})
genre.addEventListener('input', function (e) {
    this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1)
})

// функция добавления фильма на сервер 
async function addFilm(film) {

    await fetch("https://sb-film.skillbox.cc/films", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            email: "ovikdevil@gmail.com", //почту можно и свою, но оставим чью-то
        },
        body: JSON.stringify(film),
    });
    renderTable();
}

//функция получения списка фильмов с сервера 'GET'
async function serverGetFilms() {
    let filmsResponse = await fetch("https://sb-film.skillbox.cc/films", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email: "ovikdevil@gmail.com", //почту можно и свою, но оставим чью-то
        }
    })
    const films = await filmsResponse.json()
    return films
}

// функция удаления всех фильмов по нажатию кнопки
function addDeleteAllEventListeners() {
    const deleteAllBtn = document.querySelector('#deleteAll')
    deleteAllBtn.addEventListener("click", function () {
        let confirmDelete = confirm('Вы точно хотите удалить все фильмы?');

        if (confirmDelete == true) {
            deleteFilms();
        } else {
            return
        }
    });
}

// функция удаления всех фильмов
async function deleteFilms() {
    const filmsResponse = await fetch(`https://sb-film.skillbox.cc/films/`, {
        method: 'DELETE',
        headers: {
            email: "ovikdevil@gmail.com", //почту можно и свою, но оставим чью-то
        },
    })
    const films = await filmsResponse.json()
    renderTable()
}

// функция удаления конкретного фильма по id фильма
async function deleteFilm(id) {
    const filmsResponse = await fetch(`https://sb-film.skillbox.cc/films/${id}`, {
        method: 'DELETE',
        headers: {
            email: "ovikdevil@gmail.com", //почту можно и свою, но оставим чью-то
        },
    })
    const films = await filmsResponse.json()
    renderTable()
}

// функция нахождения фильма с кнопкой удаления по id
function addDeleteEventListeners() {
    const deletBtn = document.querySelectorAll('#delete')

    deletBtn.forEach((btn) => {
        btn.addEventListener("click", function (event) {
            const id = event.target.dataset.id;
            let confirmDelete = confirm('Вы точно хотите удалить этот фильм?');

            if (confirmDelete == true) {
                deleteFilm(id);
            } else {
                return
            }
        });
    });
}

// функция фильтрации фильмов
async function filterFilms(films) {
    let filteredFilms = films;
    // Фильтрация по названию
    if (filterInputTitle.value.trim() !== '') {
        filteredFilms = filteredFilms.filter(film => film.title.toLowerCase().includes(filterInputTitle.value.trim().toLowerCase()));
    }
    // Фильтрация по жанру
    if (filterInputGenre.value.trim() !== '') {
        filteredFilms = filteredFilms.filter(film => film.genre.toLowerCase().includes(filterInputGenre.value.trim().toLowerCase()));
    }
    // Фильтрация по году выпуска
    if (filterInputReleaseYear.value.trim() !== '') {
        filteredFilms = filteredFilms.filter(film => film.releaseYear === filterInputReleaseYear.value.trim());
    }
    // Фильтрация по статусу просмотра
    if (filterSelect.value === "isWatchedFilm") {
        filteredFilms = filteredFilms.filter(film => film.isWatched);
    } else if (filterSelect.value === "nonWatchedFilm") {
        filteredFilms = filteredFilms.filter(film => !film.isWatched);
    }
    return filteredFilms;
}

// функция отрисовки фильмов в таблице 
async function renderTable(filteredFilms = null) {
    let films;
    if (!filteredFilms) {
        films = await serverGetFilms();
    } else {
        films = filteredFilms;
    }

    //если нету ввода в поля фильтрации отображается список фильмов
    if (!filteredFilms) {
        filteredFilms = await filterFilms(films);
    }

    const filmTableBody = document.querySelector('#film-tbody');
    filmTableBody.innerHTML = '';

    filteredFilms.forEach((film) => {
        const row = document.createElement('tr');
        row.classList.add('table-dark');
        row.innerHTML =
            `<td class="table-dark">${film.id}</td>
        <td class="table-dark">${film.title}</td>
        <td class="table-dark">${film.genre}</td>
        <td class="table-dark">${film.releaseYear}</td>
        <td class="table-dark">${film.isWatched ? 'Да' : 'Нет'}</td>
        <td>
            <button id="delete" class="btn btn-danger delete-btn w-100" data-id="${film.id}">Удалить</button>
        </td>
        `;
        filmTableBody.append(row);
    });
    addDeleteEventListeners();
    addDeleteAllEventListeners();

    // очищаем поля формы общим сбросом
    filmForm.reset();
}

// функция валидации полей ввода
function isValidate() {

    let success = true;

    if (title.value.trim() == '') {
        title.classList.add('error')
        titleErrorMessage.textContent = 'Введите название фильма'
        nameBlock.appendChild(titleErrorMessage)
        success = false
    } else {
        title.classList.remove('error')
        titleErrorMessage.remove()
    }

    if (genre.value.trim() == '') {
        genre.classList.add('error')
        genreErrorMessage.textContent = 'Введите жанр фильма'
        genreBlock.appendChild(genreErrorMessage)
        success = false
    } else {
        genre.classList.remove('error')
        genreErrorMessage.remove()
    }

    if (releaseYear.value == '' || releaseYear.value < 1895 || releaseYear.value > currentDate) {
        releaseYear.classList.add('error')
        releaseErrorMessage.textContent = `Введите год выпуска фильма. Диапазон ввода: 1895 - ${currentDate}`
        releaseBlock.appendChild(releaseErrorMessage)
        success = false
    } else {
        releaseYear.classList.remove('error')
        releaseErrorMessage.remove()
    }

    return success
}

// слушатель события на форму с проверками 
filmForm.addEventListener('submit', function (e) {
    e.preventDefault()

    // если валидация полей === true то произойдет добавление в таблицу и перерисовка таблицы
    if (isValidate() === true) {
        handleFormSubmit()
        renderTable()
    }
})

// обработчики событий фильтра для отрисовки фильмов при изменении
filterForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const films = await serverGetFilms();
    const filteredFilms = await filterFilms(films);
    renderTable(filteredFilms);
});
filterInputTitle.addEventListener('input', async function () {
    const films = await serverGetFilms();
    const filteredFilms = await filterFilms(films);
    renderTable(filteredFilms);
});
filterInputGenre.addEventListener('input', async function () {
    const films = await serverGetFilms();
    const filteredFilms = await filterFilms(films);
    renderTable(filteredFilms);
});
filterInputReleaseYear.addEventListener('input', async function () {
    const films = await serverGetFilms();
    const filteredFilms = await filterFilms(films);
    renderTable(filteredFilms);
});
filterSelect.addEventListener('change', async function () {
    const films = await serverGetFilms();
    const filteredFilms = await filterFilms(films);
    renderTable(filteredFilms);
});
// отрисовка таблицы при запуске страницы
renderTable()

