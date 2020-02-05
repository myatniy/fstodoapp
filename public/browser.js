noteTemplate = (note) => `
<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="note-text">${note.text}</span>
  <div>
    <button note-id="${note._id}" class="edit-note btn btn-secondary btn-sm mr-1">Edit</button>
    <button note-id="${note._id}" class="delete-note btn btn-danger btn-sm">Delete</button>
  </div>
</li>
`

let myHtmlPage = notes.map((note) => noteTemplate(note)).join('')
document.getElementById('note-list').insertAdjacentHTML('beforeend', myHtmlPage)

let createNoteField = document.getElementById('create-note-field')

document.getElementById('create-note').addEventListener('submit', (e) => {
  e.preventDefault()
  axios.post('/create-note', { text: createNoteField.value }).then((res) => {
    document.getElementById('note-list').insertAdjacentHTML('beforeend', noteTemplate(res.data))
    createNoteField.value = ''
    createNoteField.focus()
  }).catch(() => {
    console.log('can not work righ')
  })
})

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-note')) {
    let inputEdit = prompt('Note edit', e.target.parentElement.parentElement.querySelector('.note-text').innerHTML)
    if (inputEdit) {
      axios.post('/update-note', { text: inputEdit, id: e.target.getAttribute('note-id') }).then(() => {
        e.target.parentElement.parentElement.querySelector('.note-text').innerHTML = inputEdit
      }).catch(() => {
        console.log('can not work righ')
      })
    }
  }

  if (e.target.classList.contains('delete-note')) {
    if (confirm('Do you really want to delete that note?')) {
      axios.post('/delete-note', { id: e.target.getAttribute('note-id') }).then(() => {
        e.target.parentElement.parentElement.remove()
      }).catch(() => {
        console.log('can not work righ')
      })
    }
  }
})
