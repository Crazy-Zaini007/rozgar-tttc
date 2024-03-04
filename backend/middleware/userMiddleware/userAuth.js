const jwt = require('jsonwebtoken')

const User = require('../../database/userdb/UserSchema')

const userAuth = async (req, res, next) => {

    const { authorization } = req.headers
    if (!authorization) {
        return res.json(401).json({ message: ' Authorization Token is required !' })
    }
    // Spliting the token into two parts and getting token from the authorization headers using split method
    const token = authorization.split(' ')[1];
    // Verifying the Token

    try{
        const{_id}=jwt.verify(token, process.env.SECRET)
        req.user=await User.findOne({_id}).select('_id')
        next()

    }
    catch(error){
        console.log(error);
        res.status(401).json({message:' Request is not Authorized !'})
    }

}
module.exports=userAuth
