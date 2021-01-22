const db = require('mysql')

const con = db.createConnection({
	host: "localhost",
	user: "root",
	password :"root",
	database: "chat"
})

con.connect(err => {
	if (err) throw err
	console.log('db connection etablished')
})


module.exports.con = con
