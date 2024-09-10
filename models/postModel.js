const db = require('../config/db')

//CRUD RESTful API for posts table with MySQL
//1.READ: GET all posts: http://localhost:3000/api/posts
const findPostAll = async (page, limit) => {
    try {
        const offset = (page - 1) * limit
        const sql = 'SELECT * FROM posts ORDER BY id DESC LIMIT ? OFFSET ?';
        const [rows] = await db.query(sql, [limit, offset]);
        return rows
    } catch (err) {
        console.log(err);
    }
}

//2.CREATE: Create a posts: http://localhost:3000/api/posts
const createPost = async (title, content, user_id) => {
    try {
        const sql = 'INSERT INTO posts(title, content, user_id) VALUES (?,?,?)';
        const [rows] = await db.query(sql, [title, content, user_id])
        return rows
    } catch (err) {
        console.log(err);
    }
}

//3.READ: Get post ById : http://localhost:3000/api/posts/:id
const findPostById = async (id) => {
    try {
        const sql = 'SELECT * FROM posts WHERE id = ?'
        const [rows] = await db.query(sql, [id]);
        return rows
    } catch (err) {
        console.log(err);
    }
}

//4.PUT: Update a post : http://localhost:3000/api/posts/:id
const updatePost = async (id, title, content, user_id) => {
    try {
        const sql = 'UPDATE posts SET title=?, content=?, user_id=? WHERE id = ?'
        const [rows] = await db.query(sql, [title, content, user_id, id])
        return rows
    } catch (err) {
        console.log(err)
    }
}

//5.DELETE: Delete a post : http://localhost:3000/api/posts/:id
const deletePost = async (id) => {
    try {
        const sql = 'DELETE FROM posts WHERE id = ?';
        const [rows] = await db.query(sql, [id])
        return rows
    } catch (err) {
        console.log(err);
    }
}
module.exports = { findPostAll, createPost, findPostById, updatePost, deletePost }

