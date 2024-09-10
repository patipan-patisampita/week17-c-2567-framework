const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware')

//CRUD RESTful API
//1.READ: Method GET, Get all posts: http://localhost:3000/api/posts
router.get('/', verifyToken, authorizeRoles(['Admin', 'User']), postController.getPosts)

//2.CREATE: Method POST, Create a posts: http://localhost:3000/api/posts
router.post('/', verifyToken, authorizeRoles(['Admin', 'User']), postController.createPost)

//3.READ: Method GET, Get posts ByID: http://localhost:3000/api/posts/:id
router.get('/:id', verifyToken, authorizeRoles(['Admin', 'User']), postController.getPostById)

//4.UPDATE: Method PUT, Update post: http://localhost:3000/api/posts/:id
router.put('/:id', verifyToken, authorizeRoles(['Admin', 'User']), postController.updatePost)

//5.DELETE: Method DELETE, Delete post: http://localhost:3000/api/posts/:id
router.delete('/:id', verifyToken, authorizeRoles(['Admin']), postController.deletePost)

module.exports = router