const express = require('express')
const router = express.Router()

require('dotenv').config()

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { postLogin, postRegister, getDashboard, getTest, logout } = require('../controllers/authController');

//Login API: http://localhost:3000/api/auth/login
router.post('/login', postLogin)

//Register API: http://localhost:3000/api/auth/register
router.post('/register', postRegister)

//Get Test (Protected) API: http://localhost:3000/api/auth/test
router.get('/test', verifyToken, authorizeRoles(['Admin', 'User']), getTest)

//Get dashboard API: http://localhost:3000/api/auth/dashboard
router.get('/dashboard', verifyToken, authorizeRoles(['Admin']), getDashboard)

//Get logout API: http://localhost:3000/api/auth/logout
router.get('/logout', verifyToken, authorizeRoles(['Admin', 'User']), logout)

module.exports = router