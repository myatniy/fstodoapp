let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')

let app = express()
let db

let port = process.env.PORT
if (port == null || port == '') {
  port = 3000
}

let connectionString = 'mongodb+srv://myatniy:7VVdkIM1wQhEzFKa@cluster0-uc8us.mongodb.net/TodoApp?retryWrites=true&w=majority'

mongodb.connect(
  connectionString,
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err, client) => {
    db = client.db()
    app.listen(port)
  }
)

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

function simpleLogin(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App')
  console.log(req.headers.authorization)
  if (req.headers.authorization == 'Basic dGVzdDp0ZXN0') {
    next()
  } else {
    res.status(401).send('Authentication required')
  }
}

app.use(simpleLogin)

app.get('/', function (req, res) {
  db.collection('notes').find().toArray((err, notes) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="display-4 text-center py-1">To-Do App!</h1>

          <div class="jumbotron p-3 shadow-sm">
            <form id="create-note" action="/create-note" method="POST">
              <div class="d-flex align-items-center">
                <input id="create-note-field" name="note" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>

          <ul id="note-list" class="list-group pb-5">
          
          </ul>

        </div>

        <script>
          let notes = ${JSON.stringify(notes)}
        </script>
        
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="./browser.js"></script>

      </body>
      </html>
    `)
  })
})

app.post('/create-note', function (req, res) {
  let safeReq = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('notes').insertOne({ text: safeReq }, (err, info) => {
    res.json(info.ops[0])
  })
})

app.post('/update-note', (req, res) => {
  let safeReq = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('notes').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text: safeReq}}, () => {
    res.send('Succes12')
  })
})

app.post('/delete-note', (req, res) => {
  db.collection('notes').deleteOne({_id: new mongodb.ObjectID(req.body.id)}, () => {
    res.send('Note was deleted')
  })
})

let htmlDocument = `
  <!DOCTYPE html>

  <style>
  @import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
  }
  
  body {
    background-color: #7A9CC6;
  }
  
  .flex-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    background-color: #aac6e8;
    width: 600px;
    padding: 20px;
    margin: 20px auto 50px;
    border: 2px solid white;
    box-shadow: 19px 21px 20px 0px rgba(0, 0, 0, 0.5);
  }
  .flex-container #todoList {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .flex-container .header {
    font-size: 20px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 7px;
    text-shadow: 3px 2px white;
  }
  .flex-container .vertically-centering-wrapper {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .flex-container .li-wrapper {
    width: 400px;
    padding: 5px;
    margin: 10px 0;
    overflow: auto;
    background-color: #7A9CC6;
  }
  .flex-container .input-form {
    margin-bottom: 20px;
  }
  .flex-container .input-field {
    width: 320px;
    padding: 6px 10px;
    border: none;
    background-color: #ffffff;
    font-size: 20px;
    outline: none;
    -webkit-transition: width 0.2s, box-shadow 0.4s ease-in-out;
    transition: width 0.2s, box-shadow 0.4s ease-in-out;
  }
  .flex-container .input-field:focus {
    box-shadow: 4px 4px rgba(0, 0, 0, 0.5);
  }
  .flex-container .note-text {
    display: inline-block;
    padding: 2px 4px;
    font-size: 20px;
  }
  .flex-container .note-text-underliner {
    border: none;
    border-top: 2px solid black;
  }
  .flex-container .btn {
    border: none;
    cursor: pointer;
  }
  .flex-container .btn:active {
    color: #f0f0f0;
    background-color: #7A9CC6;
  }
  .flex-container .btn:hover {
    box-shadow: 4px 4px rgba(0, 0, 0, 0.5);
    transition: box-shadow 0.2s ease-in-out;
  }
  .flex-container .btn-add-note {
    margin-left: 10px;
    padding: 5px 12px;
    font-size: 20px;
  }
  .flex-container .btn-edit-note, .flex-container .btn-del-note {
    margin: 5px 0;
    margin-right: 9px;
    padding: 4px 8px;
    font-size: 16px;
  }

  </style>
  <title>To-Do App</title>

  <div class="flex-container">
    <header class="header">
      <h1>To-Do App</h1>
    </header>
    
    <section class="input-form">
      <form id="todoForm" action="/create-note" method="POST">
        <div class="vertically-centering-wrapper">
          <input id="todoInputField" name="note" class="input-field" type="text" autocomplete="off">
          <button class="btn btn-add-note">+</button>
        </div>
      </form>
    </section>

    <section>
      <ul id="todoList">
        <!-- <div class="vertically-centering-wrapper li-wrapper">
          <button class="btn btn-del-note">Delete</button>
          <button class="btn btn-edit-note">Edit</button>
          <li>
            <p class="note-text">Note text</p>
            <hr class="note-text-underliner">
          </li>
        </div>
        <div class="vertically-centering-wrapper li-wrapper">
          <button class="btn btn-del-note">Delete</button>
          <button class="btn btn-edit-note">Edit</button>
          <li>
            <p class="note-text">Write a new note</p>
            <hr class="note-text-underliner">
          </li>
        </div>
        <div class="vertically-centering-wrapper li-wrapper">
          <button class="btn btn-del-note">Delete</button>
          <button class="btn btn-edit-note">Edit</button>
          <li>
            <p class="note-text">Test</p>
            <hr class="note-text-underliner">
          </li>
        </div> -->
      </ul>
    </section>
  </div>
`
