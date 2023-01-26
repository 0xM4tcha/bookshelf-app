const render = () => {
	const contents = document.querySelector('.main');
	contents.removeAttribute('hidden');
	setBooks();
}

const setBooks = (updatedBooks) => {
  const books = updatedBooks ? updatedBooks : JSON.parse(localStorage.getItem('books')) || [];
  const completeBooksElement = document.getElementById('completeBooks');
  const incompleteBooksElement = document.getElementById('incompleteBooks');
  completeBooksElement.innerHTML = '<div></div>';
  incompleteBooksElement.innerHTML = '<div></div>';
  for (let i = 0; i < books.length; i++) {
    const bookShelf = document.getElementById(`${books[i].isComplete ? 'completeBooks' : 'incompleteBooks'}`);
    const article = document.createElement('article');
    article.className = 'book-card';
    article.id = books[i].id;
    article.innerHTML = `
      <p>Title : ${books[i].title}</p>
      <p>Author : ${books[i].author}</p>
      <p>Year : ${books[i].year}</p>
      
      <div class="button-section">
        <button
          class="button-action ${books[i].isComplete ? 'complete' : 'onproggress'}"
          onclick="changeStatusBook(${books[i].id})"
        >
          ${books[i].isComplete ? '&minus;' : '&plus;'}
        </button>
        <button class="button-delete" id="delete-book" onclick="deleteBook(${books[i].id})">&#10005;</button>
      </div>
    `;
		bookShelf.appendChild(article);
  }
}

const addBook = (isComplete) => {
  console.log('addBook', isComplete);
  document.getElementById('modal-container').style.display = 'block';
  const modal = document.getElementById('modal');
  modal.innerHTML = '';
  const formInputAddBook = document.createElement('form');
  formInputAddBook.id = 'form-add-book';
  formInputAddBook.innerHTML = `
    <div class="form-wrapper">
      <div class="header">
        <h1>Input Your Book</h1><span id="close-modal" class="close" onclick="closeModal()">&times;</span>
      </div>
      <div class="body">
        <div class="input">
          <label for="title">Title</label>
          <input id="title" type="text" required>
        </div>
        <div class="input">
          <label for="author">Author</label>
          <input id="author" type="text" required>
        </div>
        <div class="input">
          <label for="year">Year</label>
          <input id="year" type="number" required>
        </div>
        <div class="input">
          <label for="status">Status Read</label>
          <label for="status" style="color: ${isComplete ? '#3D8361' : '#D6CDA4'}">
            ${isComplete ? 'COMPLETE' : 'ONPROGGRESS' }
          </label>
        </div>
        <button id="submit" type="submit">SUBMIT</button>
      </div>
    </div>
  `
  modal.appendChild(formInputAddBook);
  const submitAction = document.getElementById('form-add-book');
  submitAction.addEventListener('submit', function (event) {
    const currentBooks = JSON.parse(localStorage.getItem('books')) || [];
    const book = {
      id: + new Date(),
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      year: document.getElementById('year').value,
      isComplete: isComplete,
    }
    currentBooks.push(book);
    localStorage.setItem('books', JSON.stringify(currentBooks));
  });
}

const changeStatusBook = (id) => {
  const currentBooks = JSON.parse(localStorage.getItem('books'));
  currentBooks.forEach((book) => { 
    if (book.id === id) {
      book.isComplete = !book.isComplete;
    }
   })
   localStorage.setItem('books', JSON.stringify(currentBooks));
   setBooks();
};

const deleteBook = (id) => {
  const confirmationModal = document.getElementById('modal-container');
  confirmationModal.style.display = 'block';
  const modal = document.getElementById('modal');
  modal.innerHTML = `
    <div class="modal-delete-book">
      <h1 class="title">Are you sure ?</h1>
      <div class="action">
        <button class="button-delete" id="close-modal" onclick="closeModal()">&#10005;</button>
        <button class="button-action" id="submit-delete" onclick="submitDelete(${id})">&#10003;</button>
      </div>
    </div>
  `
}

const submitDelete = (id) => {
  const currentBooks = JSON.parse(localStorage.getItem('books'));
	const filteredBooks = currentBooks.filter((book) => book.id !== id)
  localStorage.setItem('books', JSON.stringify(filteredBooks)) 
  setBooks();
  closeModal();
}

const searchBook = document.getElementById('searchBook');

searchBook.addEventListener('submit', function (event) {
  const currentBooks = JSON.parse(localStorage.getItem('books')) || [];
  const searchValue = document.getElementById('searchBookTitle').value;
  const filteredBooks = currentBooks.filter((book) => book.title.toLowerCase().includes(searchValue.toLowerCase()))
  setBooks(filteredBooks);
  event.preventDefault();
});

const closeModal = () => {
  document.getElementById('modal-container').style.display = "none";
}
