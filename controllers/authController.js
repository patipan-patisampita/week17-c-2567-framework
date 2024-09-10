const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const db = require('../config/db')

//Login API: http://localhost:3000/api/auth/login
const postLogin = async (req, res) => {
    // const email = req.body.email
    // const password = req.body.password
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
            return res.redirect('/login')
        }

        const user = rows[0]
        //2.Check password
        const match = await bcrypt.compare(password, user.password)
        // console.log({ message: match })

        if (!match) {
            // return res.status(401).json({
            //     state: false, massege: "Invalid username or password.",
            // })
            return res.redirect('/login')
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
        res.cookie('accessToken', token, cookieOption)
        // return res.status(200).json({
        //     state: true,
        //     massege: "You have successfully logged in.",
        //     data: payload,
        //     token: token
        // })
        return res.status(200).redirect('/api/auth/dashboard')
    } catch (error) {
        console.log(error.message)
        // return res.status(500).json({ status: true, message: "Server error" })
        return res.redirect('/login')
    }

}

//Register API: http://localhost:3000/api/auth/register
const postRegister = async (req, res) => {
    const { title, first_name, last_name, email, password, address } = req.body
    //1.Check email exits ? if Yess --- Stop execution
    const sql = "SELECT * FROM users WHERE email=?"
    db.query(sql, [email])
        .then((result) => {
            if (result[0] && result[0][0] && result[0][0].id) {
                // return res.status(201).json({
                //     'message': true,
                //     'data':result[0]
                // })
                res.redirect('/register')
            }
            else {
                //2.Hash password
                const hashRounds = 10
                bcrypt.genSalt(hashRounds, async (err, salt) => {
                    if (err) {
                        return res.status(500).send('Unable to generate Salt')
                    }
                    bcrypt.hash(password, salt, async (err, hash) => {
                        // Store hash in your password DB.
                        if (err) {
                            return res.status(500).send('Unable to create Hash')
                        }
                        // return res.send('>>>' + hash)
                        // 3.Store hash in your password DB
                        const sql = 'INSERT INTO users(title, first_name, last_name, role, email, password, address) VALUES (?,?,?,?,?,?,?)';
                        const values = [title, first_name, last_name, 'User', email, hash, address]
                        await db.query(sql, values)
                            .then((result) => {
                                console.log(hash)
                                return res.status(201).json({
                                    'message': true,
                                    'first_name': first_name,
                                    'last_name': last_name,
                                    'data': hash
                                })
                                // return res.redirect("/login")
                            }).catch((err) => {
                                if (!res.headersSent) {
                                    return res.status(500).send(err)
                                }
                            });
                    });
                });
            }
        }).catch((err) => {
            console.log('ERROR check mail', err)
            return
        });


}

//Get Test (Protected) API:http://localhost:3000/api/auth/test
const getTest = (req, res) => {
    console.log(req.role)
    return res.status(200).json({ status: true, message: 'Welcome to the test page' })
}

//Get Test (Protected) API:http://localhost:3000/api/auth/dashboard
const getDashboard = (req, res) => {
    console.log(req.role)
    // return res.status(200).json({ status: true, message: 'Welcome to the dashboard page' })
    return res.status(200).render('dashboard/index.ejs')
}

const logout = (req, res) => {
    res.clearCookie('accessToken')
    return res.status(200).redirect('/login')
}

module.exports = { postLogin, postRegister, getTest, getDashboard, logout }