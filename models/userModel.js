const db = require('../config/db')

const createUser = async (title, first_name, last_name, role, email, hash, address) => {
    const query = "INSERT INTO users(title, first_name, last_name, role, email, hash, address) VALUES(?,?,?,?,?,?,?)"
    const values = [title, first_name, last_name, role, email, hash, address]
    return db.query(query, values)
}

const findUserEmail = async (email) => {
    const query = "SELECT * FROM users WHER email=?"
    const [rows] = await db.query(query, [email])
    return rows[0]
}

const findUserAll = async () => {
    const [rows] = await db.query("SELECT * FROM users")
    return rows
}

const findUserById = async (id) => {
    const query = "SELECT * FROM users WHERE id=?"
    const [rows] = await db.query(query, [id])
    return rows
}

const updateUser = async (id, title, first_name, last_name, role, email, hash, address) => {
    const query = "UPDATE users SET title=?, first_name=?, last_name=?, role=?, email=?, password=?, address=? WHERE id=?"
    const values = [title, first_name, last_name, role, email, hash, address, id]
    const [rows] = await db.query(query, values)
    return rows
}

const deleteUser = async (id) => {
    const query = "DELETE FROM users WHERE id=?"
    const [rows] = await db.query(query, [id])
    return rows
}

module.exports = { createUser, findUserEmail, findUserAll, findUserById, updateUser, deleteUser }