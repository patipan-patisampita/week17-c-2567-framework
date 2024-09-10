const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../config/db')

//http://localhost:3000/
router.get('/', (req, res) => {
    return res.render('index')
})

//http://localhost:3000/vision
router.get('/vision', (req, res) => {
    return res.render('vision')
})

//http://localhost:3000/vision
// router.get('/users', (req, res) => {
//     db.query('SELECT * FROM users', (err, rows) => {
//         if (err) {
//             console.log('Error fetching data');
//         } else {
//             res.json(rows)
//         }
//     })
// })

//http://localhost:3000/login
router.get('/login', (req, res) => {
    res.render('auth/login')
})

//http://localhost:3000/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    // res.send({email,password})
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email])
    if (!rows[0]) {
        return res.send('Invalid email or password given')
    }

    const isPasswordMatching = await bcrypt.compare(password, rows[0].password)
    if (!isPasswordMatching) {
        return res.status(401).send("Invalid email or password given")
    } else {
        // return res.send('Correct credential')
        res.redirect('/dashboard')
    }

})

//http://localhost:3000/register
router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', async (req, res) => {
    const { title, first_name, last_name, email, password, address } = req.body
    //1.Check email exits ? if Yess --- Stop execution
    const sql = "SELECT * FROM users WHERE email=?"
    db.query(sql, [email])
        .then((result) => {
            if (result[0] && result[0][0] && result[0][0].id) {
                // return res.status(200).send(result[0])
                console.log(result[0][0].id)
                return res.redirect('/register')
            } else {
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
                                return res.redirect("/login")
                            }).catch((err) => {
                                if (!res.headersSent) {
                                    return res.status(500).send(err)
                                }
                            });
                    });
                });
            }

        }).catch((err) => {
            console.log(err)
            return
        });
})

router.get('/dashboard', (req, res) => {
    return res.status(200).render('dashboard/index.ejs')
})

module.exports = router