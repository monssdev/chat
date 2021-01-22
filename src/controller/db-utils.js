const db = require('../config/db-connection.js')

const query = {
	insert : {
		user: nickname => `INSERT INTO user(nickname) VALUES('${nickname}')`
	},

	fetch : {
		user: `SELECT nickname FROM user`
	}
}

const insertUser = nickname => {
	db.con.query(query.insert.user(nickname), (err) => {
		if (err) throw err
		console.log('Query OK. user inserted into db')
	})
}

const fetchUser = () => new Promise(s => {
	db.con.query(query.fetch.user, (err, results) => {
		if (err) throw err
		s(results)
	})
})

module.exports.insertUser = insertUser
module.exports.fetchUser = fetchUser


