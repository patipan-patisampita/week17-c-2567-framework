const express = require('express')
const router = express.Router()

require('dotenv').config()

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const { postLogin, postRegister, getDashboard, getTest, logout } = require('../controllers/authController');

//1.GET  => Login form: http://localhost:3000/api/auth/login
//1.POST => Login API: http://localhost:3000/api/auth/login
router.get('/login', (req, res) => res.render('auth/login'))
router.post('/login', postLogin)

//2.GET => Register form: http://localhost:3000/api/auth/register
//2.POST=> Register API: http://localhost:3000/api/auth/register
router.get('/register', (req, res) => res.render('auth/register'))
router.post('/register', postRegister)

//Get Test (Protected) API: http://localhost:3000/api/auth/test
router.get('/test', verifyToken, authorizeRoles(['Admin', 'User']), getTest)

//Get dashboard API: http://localhost:3000/api/auth/dashboard
router.get('/dashboard', verifyToken, authorizeRoles(['Admin']), getDashboard)

//Get logout API: http://localhost:3000/api/auth/logout
router.get('/logout', verifyToken, authorizeRoles(['Admin', 'User']), logout)

module.exports = router