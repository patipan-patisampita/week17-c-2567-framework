const Post = require('../models/postModel')

//CRUD RESTful API
//1.READ: GET all posts: http://localhost:3000/api/posts
const getPosts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const posts = await Post.findPostAll(Number(page), Number(limit))
        console.log(posts)
        return res.status(200).send(posts)
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Failed to retrieve posts.', error })
    }
}

//2.CREATE: Create a posts: http://localhost:3000/api/posts
const createPost = async (req, res) => {
    const { title, content, user_id } = req.body
    try {
        await Post.createPost(title, content, user_id)
        console.log(title, content, user_id)
        return res.status(201).json({ status: true, message: 'Create posts successfully!' })
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Internal Server Error', error })

    }
}

//3.READ: Get post ById : http://localhost:3000/api/posts/:id
const getPostById = async (req, res) => {
    const { id } = req.params
    try {
        const posts = await Post.findPostById(id)
        return res.status(200).json({ status: true, message: 'Get posts by ID successfully!', posts })
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error get posts by ID', error })
    }
}

//4.PUT: Update a post : http://localhost:3000/api/posts/:id
const updatePost = async (req, res) => {
    const { id } = req.params
    const { title, content, user_id } = req.body

    try {
        await Post.updatePost(id, title, content, user_id)
        return res.status(200).json({ status: true, message: 'Updated posts successfully!' })

    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error updated posts', error })
    }
}


//5.DELETE: Delete a post : http://localhost:3000/api/posts/:id
const deletePost = async (req, res) => {
    const { id } = req.params
    try {
        await Post.deletePost(id)
        return res.status(200).json({ status: true, message: 'Deleted posts successfully!' })

    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error deleted posts', error })

    }
}

module.exports = { getPosts, createPost, getPostById, updatePost, deletePost }