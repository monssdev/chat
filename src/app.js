const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const session = require('express-session')
const query = require('./controller/db-utils.js')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('views'))
app.use(session({secret: "shhh"}))
app.set('view engine', 'ejs')

var sess
app.get('/', (req, res) => {
	res.render('index.ejs')
})

app.get('/register', (req, res) => {
	res.render('register.ejs')
})

app.get('/login', (req, res) => {
	res.render('login.ejs')
})

app.get('/chat', (req, res) => {
	if(sess.nickname) {
		res.render('chat.ejs', {
			nickname: sess.nickname
		})
	}
})

app.post('/user_register', (req, res) => {
	query.insertUser(req.body.nickname)
	res.redirect('/')
})

app.post('/user_login', (req, res) => {
	sess = req.session
	query.fetchUser().then(results => {
		for(row of results) {
			if(row.nickname == req.body.nickname) {
				sess.nickname = req.body.nickname
				res.redirect('/chat')
			}
		}
	})
})

var users = {
	usersConnected: 0,
	connections: []
}

io.on('connection', socket => {
	users.usersConnected = users.usersConnected + 1

	socket.on('clients info', info => {
		let user = {
			username: info,
			socketId: socket.id
		}

		users.connections.push(user)

		io.emit('users connected', users)
	})

	socket.on('general', msg => {
		io.emit('general', msg)
	})

	socket.on('disconnect', () => {
		users.usersConnected = users.usersConnected - 1
		for (let i = 0; i <= users.connections.length - 1; i++) {
			if (users.connections[i]["socketId"] == socket.id) {
				io.emit('user disconnect', users.connections[i])
				users.connections.splice(i, 1)
			}
		}
	})
})

server.listen(3000)

