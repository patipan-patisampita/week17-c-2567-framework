const jwt = require('jsonwebtoken');

//Middleware for Token Authentication
const verifyToken = async (req, res, next) => {
    // const token = req.headers.authorization?.split(' ')[1]
    const token = req.cookies.accessToken
    if (!token) {
        // return res.status(401).send({ status: false, message: 'Not token, authorization denied' })
        return res.redirect('/login')
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                // return res.status(401).send({ status: false, message: 'Invald token' })
                return res.redirect('/login')
            }
            // console.log(decoded)
            req.userId = decoded.userId
            req.role = decoded.role
            req.user = decoded
            next()
        })
    } catch (error) {
        // return res.status(401).send({ status: false, message: 'Token is not valid' })
        return res.redirect('/login')
    }
}

//Check Admin
// const isAdmin = async (req, res) => {
//     console.log(req.role)
//     if (req.role !== 'Admin') {
//         return res.status(403).send({ success: false, messagr: "Unauthorized user" })
//     }
//     try {
//         console.log(req.role)
//         return res.status(200).json({ message: 'Welcome to the admin dashboard' });
//     } catch (error) {
//         return res.status(403).json({
//             success: false,
//             message: "error in isUser middleware"
//         })
//     }
// }

//Check User
// const isUser = async (req, res) => {
//     console.log(req.role)
//     if (req.role !== 'User') {
//         return res.status(403).send({ success: false, messagr: "Unauthorized user" })
//     }
//     try {
//         console.log(req.role)
//         return res.status(200).json({ message: 'Welcome to the user page' });
//     } catch (error) {
//         return res.status(403).json({
//             success: false,
//             message: "error in isUser middleware"
//         })
//     }
// }

//Middleware for Role-Based Authtization
const authorizeRoles = (roles) => (req, res, next) => {
    if (!roles.includes(req.role)) {
        return res.status(403).json({ status: false, message: 'Access denied.' })
    }
    next()
}

module.exports = { verifyToken, authorizeRoles }