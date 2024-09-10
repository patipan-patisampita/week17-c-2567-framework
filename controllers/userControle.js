const User = require('../models/userModel')
const bcrypt = require('bcryptjs');

//1.Get All Users:http://localhost:3000/api/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findUserAll()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error Get All users' })
    }
}

//2.Get User By Id:http://localhost:3000/api/users/:id
const getUserById = async (req, res) => {
    const user = await User.findUserById(req.params.id)
    if (!user) {
        return res.status(404).json({ status: false, message: 'User not found.' })
    }

    try {
        return res.status(200).json({ status: true, message: user })
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error retrieving users.' })
    }
}

//3.PUT Users: http://localhost:3000/api/users/:id
const upadateUser = async (req, res) => {
    //Access data
    const userId = req.params.id
    const { title, first_name, last_name, role, email, password, address } = req.body
    try {
        //Hash password
        const hashRounds = 10
        const salt = await bcrypt.genSaltSync(hashRounds);
        const hash = await bcrypt.hashSync(password, salt);
        //Save data
        await User.updateUser(userId, title, first_name, last_name, role, email, hash, address)
        console.log(req.params.id)
        return res.status(200).json({ status: true, message: 'User updated successfully!' })
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error Updating users.' })
    }
}

//4.DELETE Users: http://localhost:3000/api/users/:id
const deleteUser = async (req, res) => {
    try {
        await User.deleteUser(req.params.id)
        return res.status(200).json({ status: true, message: 'Delete user successfully!' })
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error Deleting users.' })
    }
}

module.exports = { getAllUsers, getUserById, upadateUser, deleteUser }
