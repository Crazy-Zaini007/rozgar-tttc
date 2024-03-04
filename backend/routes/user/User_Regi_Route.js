const  express = require('express');
const { signupUser,loginUser,getAllUsers,updateUser } = require('../../controllers/user/JoinUserContr')
const userAuth = require('../../middleware/userMiddleware/userAuth')

const router=express.Router()

// For Registering The user
router.post("/register",signupUser)

//For Login the User
router.post("/login",loginUser)


router.use(userAuth)

//getting users
router.get('/get/users',getAllUsers)

//updating users
router.patch('/update/users',updateUser)
module.exports = router
