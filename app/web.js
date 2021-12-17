const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const { ESRCH } = require("constants")


const app = express()
const server = http.Server(app)
const io = socketio(server)

const title = "Jeopardy 2021"

let data = {
    users: new Set(),
    buzzes : new Set(),
}

app.use(express.static("public"))
app.set("view engine", "pug")

app.get("/", (req, res) => res.render("index", { title }))
app.get("/join", (req, res) => res.render('join'))
app.get("/host", (req, res) => res.render("host"))
app.get("/create", (req, res) => res.render('create'))

io.on('connection', (socket) => {
    socket.on('join', (user) => {
        data.users.add(user.id)
        io.emit('active', [...data.users].length)
        console.log(`${user.name} joined!`)
    })

    socket.on('buzz', (user) => {
        data.buzzes.add(`${user.name}-${user.team}`)
        io.emit('buzzes', [...data.buzzes])
        console.log(`${user.name} buzzed in`)
    })

    socket.on("clear", () => {
        data.buzzes = new Set()
        io.emit('buzzes', [...data.buzzes])
        console.log(`Clear buzzes`)
    })
})

const port = process.env.PORT || 3000
server.listen(port, function () {
    console.log("JeopardyApp listening on port " + port)
});