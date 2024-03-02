const books = [];

const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF';

const btnAddBook = document.getElementById("add-button");
const formContainer = document.getElementById("form-container");
const editFormContainer = document.getElementById("edit-form-container");

// show input form
let clicked = false;
btnAddBook.addEventListener("click", () => {
    if (clicked) {
        formContainer.style.display = "none";
        formContainer.style.zIndex = "-1";
        clicked = false;
        btnAddBook.children[0].src = "assets/add-button.png";
    } else {
        formContainer.style.display = "flex";
        setTimeout(() => {
            formContainer.style.zIndex = "initial";
        }, 1000);
        clicked = true;
        btnAddBook.children[0].src = "assets/minimize-button.png"
    }
})
document.addEventListener(SAVED_EVENT, () => {
    alert("Data Berhasil Disimpan")
})
document.addEventListener(RENDER_EVENT, () => {
    const notFinished = document.getElementById('not-finished');
    notFinished.innerHTML = '';

    const finished = document.getElementById('finished');
    finished.innerHTML = '';

    for (const item of books) {
        const itemElement = makeElement(item);
        if (!item.isCompleted) {
            notFinished.append(itemElement);
        } else {
            finished.append(itemElement);
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    // submit form
    const submitForm = document.getElementById("form");
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    })
    // load data sotrage
    if (isStorageExist()) {
        loadDataFromStorage();
    }

})


function addBook() {
    const ID = new Date().getTime();
    const titleBook = document.getElementById("title").value;
    const authorBook = document.getElementById("author").value;
    const yearBook = document.getElementById("year").value;
    const isCompleted = document.getElementById("iscompleted").checked;

    const bookObject = generateBookObjet(ID, titleBook, authorBook, yearBook, isCompleted);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateBookObjet(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}
function makeElement(item) {
    const container = document.createElement('div');
    container.classList.add('item');
    container.setAttribute('id', `book-` + item.id);


    if (item.isCompleted) {

        const itemInfo =
            `<div  class="item-info">
            <p class="item-title">`+ item.title + `</p>
            <p class="item-author">`+ item.author + `</p>
            <p class="item-year">`+ item.year + `</p>
        </div></br>
        <div class="btn-container">
            <button class="button btn-delete" id="btn-delete" onclick="deleteBook(`+ item.id + `)"><svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C5.33726 0 4.8 0.537258 4.8 1.2V2.4H1.2C0.537258 2.4 0 2.93726 0 3.6C0 4.26274 0.537258 4.8 1.2 4.8H18C18.6627 4.8 19.2 4.26274 19.2 3.6C19.2 2.93726 18.6627 2.4 18 2.4H14.4V1.2C14.4 0.537258 13.8627 0 13.2 0H6ZM3.6 7.2C3.6 6.53726 3.06274 6 2.4 6C1.73726 6 1.2 6.53726 1.2 7.2V20.4C1.2 22.3882 2.81178 24 4.8 24H14.4C16.3882 24 18 22.3882 18 20.4V7.2C18 6.53726 17.4627 6 16.8 6C16.1373 6 15.6 6.53726 15.6 7.2V20.4C15.6 21.0627 15.0627 21.6 14.4 21.6H4.8C4.13726 21.6 3.6 21.0627 3.6 20.4V7.2ZM7.2 7.2C7.86274 7.2 8.4 7.73726 8.4 8.4V18C8.4 18.6627 7.86274 19.2 7.2 19.2C6.53726 19.2 6 18.6627 6 18V8.4C6 7.73726 6.53726 7.2 7.2 7.2ZM13.2 8.4C13.2 7.73726 12.6627 7.2 12 7.2C11.3373 7.2 10.8 7.73726 10.8 8.4V18C10.8 18.6627 11.3373 19.2 12 19.2C12.6627 19.2 13.2 18.6627 13.2 18V8.4Z" fill="white"/>
            </svg>
            </button>
            <button class="button btn-change" id="btn-change" onclick="editBook(`+ item.id + `)">Edit</button>
            <button class="button btn-change" id="btn-change" onclick="unFinished(`+ item.id + `)">Unfinished</button>
        </div>
        `;

        container.innerHTML = itemInfo;
    } else {
        const itemInfo =
            `<div class="item-info">
            <p class="item-title">`+ item.title + `</p>
            <p class="item-author">`+ item.author + `</p>
            <p class="item-year">`+ item.year + `</p>
        </div></br>
            <div class="btn-container">
                  <button class="button btn-delete" id="btn-delete" onclick="deleteBook(`+ item.id + `)"><svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C5.33726 0 4.8 0.537258 4.8 1.2V2.4H1.2C0.537258 2.4 0 2.93726 0 3.6C0 4.26274 0.537258 4.8 1.2 4.8H18C18.6627 4.8 19.2 4.26274 19.2 3.6C19.2 2.93726 18.6627 2.4 18 2.4H14.4V1.2C14.4 0.537258 13.8627 0 13.2 0H6ZM3.6 7.2C3.6 6.53726 3.06274 6 2.4 6C1.73726 6 1.2 6.53726 1.2 7.2V20.4C1.2 22.3882 2.81178 24 4.8 24H14.4C16.3882 24 18 22.3882 18 20.4V7.2C18 6.53726 17.4627 6 16.8 6C16.1373 6 15.6 6.53726 15.6 7.2V20.4C15.6 21.0627 15.0627 21.6 14.4 21.6H4.8C4.13726 21.6 3.6 21.0627 3.6 20.4V7.2ZM7.2 7.2C7.86274 7.2 8.4 7.73726 8.4 8.4V18C8.4 18.6627 7.86274 19.2 7.2 19.2C6.53726 19.2 6 18.6627 6 18V8.4C6 7.73726 6.53726 7.2 7.2 7.2ZM13.2 8.4C13.2 7.73726 12.6627 7.2 12 7.2C11.3373 7.2 10.8 7.73726 10.8 8.4V18C10.8 18.6627 11.3373 19.2 12 19.2C12.6627 19.2 13.2 18.6627 13.2 18V8.4Z" fill="white"/>
                  </svg></button>
            <button class="button btn-change" id="btn-change" onclick="editBook(`+ item.id + `)">Edit</button>

                  <button class="button btn-change" id="btn-change" onclick="finished(`+ item.id + `)">Finished</button>
            </div>`;

        container.innerHTML = itemInfo;
    }

    return container;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser is not support local storage')
        return false
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function finished(Id) {
    const bookTarget = findBook(Id)

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(Id) {
    for (const item of books) {
        if (item.id == Id) {
            return item;
        }
    }
    return null
}

function deleteBook(Id) {
    if (confirm("Are You Sure to Delete?")) {
        const bookTarget = findBookIndex(Id);

        if (bookTarget === -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function unFinished(Id) {
    const bookTarget = findBook(Id);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(Id) {
    for (const index in books) {
        if (books[index].id === Id) {
            return index;
        }
    }
    return -1;
}

function editBook(Id) {
    editFormContainer.style.display = "flex";
    const editForm = document.getElementById("edit-form");
    editForm.addEventListener('submit', () => {
        const newTitleBook = document.getElementById("edit-title").value;
        const newAuthorBook = document.getElementById("edit-author").value;
        const newYearBook = document.getElementById("edit-year").value;
        const bookTarget = findBook(Id);

        bookTarget.title = newTitleBook;
        bookTarget.author = newAuthorBook;
        bookTarget.year = newYearBook;
        saveData();
    })
}

function cancelEdit() {
    editFormContainer.style.display = "none";
}