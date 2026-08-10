
const myLibrary = [];

function Book(title, author, pages, read = false) {
  this.title = title
  this.author = author
  this.pages = Number(pages)
  this.read = read
  this.id = crypto.randomUUID()
}

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read)
  myLibrary.push(book)
}

function renderBooks() {
  const booksContainer = document.querySelector('.books')
  booksContainer.textContent = ''

  myLibrary.forEach((book) => {
    const card = document.createElement('div')
    card.classList.add('book', 'card', 'card--padded', 'card--shadow-small')
    card.dataset.id = book.id

    const textPair = document.createElement('div')
    textPair.classList.add('text-pair')

    const title = document.createElement('h2')
    title.classList.add('text-pair__title')
    title.textContent = book.title

    const author = document.createElement('p')
    author.classList.add('text-pair__subtitle')
    author.textContent = book.author

    textPair.append(title, author)

    const meta = document.createElement('div')
    meta.classList.add('book__meta')

    const pages = document.createElement('span')
    pages.classList.add('book__pages')
    pages.textContent = `${book.pages} pages`

    const read = document.createElement('span')
    read.classList.add('tag', book.read ? 'tag--primary' : 'tag--notice')
    read.textContent = book.read ? 'Read' : 'Not read yet'

    const remove = document.createElement('button')
    remove.classList.add('btn', 'btn--small', 'btn--icon', 'book__remove')
    remove.type = 'button'
    remove.dataset.action = 'remove'
    remove.textContent = '×'
    remove.setAttribute('aria-label', `Remove ${book.title}`)

    meta.append(pages, read)

    card.append(remove, textPair, meta)
    booksContainer.appendChild(card)
  })
}

document.querySelector('.books').addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-action="remove"]')
  if (!removeButton) return

  const id = removeButton.closest('.book').dataset.id
  const index = myLibrary.findIndex((book) => book.id === id)
  if (index === -1) return

  myLibrary.splice(index, 1)
  renderBooks()
})

const newBookDialog = document.querySelector('#new-book-dialog')
const newBookForm = document.querySelector('#new-book-form')

document.querySelector('#new-book-button').addEventListener('click', () => {
  newBookForm.reset()
  newBookDialog.showModal()
})

document.querySelector('#cancel-book-button').addEventListener('click', () => {
  newBookDialog.close()
})

newBookForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const data = new FormData(newBookForm)
  addBookToLibrary(
    data.get('title'),
    data.get('author'),
    data.get('pages'),
    newBookForm.elements.read.checked
  )

  renderBooks()
  newBookDialog.close()
})

addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 310, true)
addBookToLibrary('Dune', 'Frank Herbert', 412)

renderBooks()