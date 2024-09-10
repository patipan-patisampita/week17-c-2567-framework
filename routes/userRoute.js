const express = require('express')
const router = express.Router()

const userController = require('../controllers/userControle')
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware')

//1.Get All Users:http://localhost:3000/api/users/
router.get('/', verifyToken, authorizeRoles(['Admin', 'User']), userController.getAllUsers)

//2.Get User by Id :http://localhost:3000/api/users/:id
router.get('/:id', verifyToken, authorizeRoles(['Admin', 'User']), userController.getUserById)

//3.Updated User by Id :http://localhost:3000/api/users/:id
router.put('/:id', verifyToken, authorizeRoles(['Admin', 'User']), userController.upadateUser)

//4.Delete User by Id :http://localhost:3000/api/users/:id
router.delete('/:id', verifyToken, authorizeRoles(['Admin']), userController.deleteUser)

module.exports = router