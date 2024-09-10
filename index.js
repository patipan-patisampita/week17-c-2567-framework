const express = require('express')
const app = express()
const logger = require('morgan')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const path = require('path')

const PORT = process.env.PORT || 3001

//HTTP request logger middleware for node.js 
app.use(logger('dev'))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
// - Version Express 4.16.0+ UP
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', require('./routes/index'))
app.use('/api/auth', require('./routes/authRoute'))
app.use('/api/users', require('./routes/userRoute'))
app.use('/api/posts', require('./routes/postRoute'))

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})