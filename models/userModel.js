const db = require('../config/db')

const createUser = async (title, first_name, last_name, role, email, hash, address) => {
    try {
        const query = "INSERT INTO users(title, first_name, last_name, role, email, password, address) VALUES(?,?,?,?,?,?,?)"
        const values = [title, first_name, last_name, role, email, hash, address]
        const [rows] = await db.query(query, values)
        return rows
    } catch (error) {
        console.log(error)
    }
}

const findUserEmail = async (email) => {
    try {
        const query = "SELECT * FROM users WHERE email=?"
        const [rows] = await db.query(query, [email])
        return rows[0]
    } catch (error) {
        console.log(error)
    }
}

const findUserAll = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM users")
        return rows
    } catch (error) {
        console.log(error)
    }
}

const findUserById = async (id) => {
    try {
        const query = "SELECT * FROM users WHERE id=?"
        const [rows] = await db.query(query, [id])
        return rows
    } catch (error) {
        console.log(error)
    }
}

const updateUser = async (id, title, first_name, last_name, role, email, hash, address) => {
   try {
       const query = "UPDATE users SET title=?, first_name=?, last_name=?, role=?, email=?, password=?, address=? WHERE id=?"
       const values = [title, first_name, last_name, role, email, hash, address, id]
       const [rows] = await db.query(query, values)
       return rows
   } catch (error) {
       console.log(error)
   }
}

const deleteUser = async (id) => {
    try {
        const query = "DELETE FROM users WHERE id=?"
        const [rows] = await db.query(query, [id])
        return rows
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createUser, findUserEmail, findUserAll, findUserById, updateUser, deleteUser }