const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const db = require('../config/db')
const User = require('../models/userModel')

//1.Login API: http://localhost:3000/api/auth/login
const postLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);

        //1.Check email
        // console.log(rows.length)
        if (rows.length === 0) {
            // return res.status(401).json({
            //     state: false, massege: "Invalid username or password"
            // })
            return res.redirect('/api/auth/login')
        }

        const user = rows[0]
        //2.Check password
        const match = await bcrypt.compare(password, user.password)
        // console.log({ message: match })

        if (!match) {
            // return res.status(401).json({
            //     state: false, massege: "Invalid username or password.",
            // })
            return res.redirect('/api/auth/login')
        }

        const name = user.first_name + " " + user.last_name
        const payload = { userId: user.id, name: name, role: user.role, email: user.email }
        //3.Create JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_KEY })
        //4.This cookie also expires after 60000 ms from the time is set
        // res.cookie('accessToken', token, { httpOnly: true, maxAge: 60000 })
        const cookieOption = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }
        await res.cookie('accessToken', token, cookieOption)

        if (payload.role === 'Admin') {
            return res.status(200).redirect('/api/auth/dashboard')
        } else if (payload.role === 'User') {
            return res.status(200).redirect('/api/auth/users-page')
        }
        // return res.status(200).json({
        //     state: true,
        //     massege: "You have successfully logged in.",
        //     data: payload,
        //     token: token
        // })

    } catch (error) {
        console.log(error.message)
        // return res.status(500).json({ status: true, message: "Server error" })
        return res.redirect('/api/auth/login')
    }

}

//2.Register API: http://localhost:3000/api/auth/register
const postRegister = async (req, res) => {
    const { title, first_name, last_name, email, password, address } = req.body
    //1.Check fielsd empty ?
    if (!title, !first_name, !last_name || !email || !password) {
        // return res.status(400).json({ status: false, message: 'All fields are required.' })
        return res.redirect('/api/auth/register')
    }

    //2.Check Email already exists ?
    const userExists = await User.findUserEmail(email);
    if (userExists) {
        // return res.status(409).json({ status: false, message: 'User or Email already exists.' })
        return res.redirect('/api/auth/register')
    }
    //3.Hash password
    const hashRounds = 10
    const salt = await bcrypt.genSaltSync(hashRounds)
    const hash = await bcrypt.hashSync(password, salt)
    try {
        const role = 'User'
        await User.createUser(title, first_name, last_name, role, email, hash, address)
        // return res.status(201).json({ status: true, message: 'User created successfully.', data: req.body })
        return res.redirect('/api/auth/login')
    } catch (err) {
        // return res.status(500).json({ error: err.message })
        return res.redirect('/api/auth/register')
    }
}

//3.Get Test (Protected) API:http://localhost:3000/api/auth/test
const getTest = (req, res) => {
    try {
        console.log(req.role)
        return res.status(200).json({ status: true, message: 'Welcome to the test page' })
    } catch (error) {
        return res.status(400).render('dashboard', { error: 'An error occurred' })
    }
}

//4.Get Test (Protected) API:http://localhost:3000/api/auth/dashboard
const getDashboard = async (req, res) => {
    try {
        const users = await User.findUserById(req.userId)
        console.log(users)
        return res.status(200).render('dashboard/index.ejs', { users })
    } catch (error) {
        console.lohg(error)
        return res.status(400).render('dashboard', { error: 'An error occurred' })
    }
}

const logout = (req, res) => {
    res.clearCookie('accessToken')
    return res.status(200).redirect('/api/auth/login')
}

module.exports = { postLogin, postRegister, getTest, getDashboard, logout }