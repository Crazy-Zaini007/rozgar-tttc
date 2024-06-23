const User = require('../../database/userdb/UserSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//creating token
const createToken = (_id) =>{
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '100days' });
    
}

//User Registration Controller

const signupUser = async (req,res) => {
    try {
        const { userName, role,companyCode, password } = req.body
  let emptyFields = []
        
        // Validation
    if (!userName) {
    emptyFields.push('userName')
      // throw Error('Name is Required');

    }
    if (!role) {
    emptyFields.push('role')
      // throw Error('Email is Required');
    }

    if (!password) {
    emptyFields.push('password')
      // throw Error('Password is Required');
    }

        if(emptyFields.length > 0) {
          return res.status(400).json({ message: 'Please fill in all the fields', emptyFields })
        }
        
        
        if(companyCode ==='RozgarTTTC123'){
            const existingUser = await User.findOne({ role });
            if (existingUser) {
                return res.status(400).json({
                    message: `User with role ${role} already exists`,
                });
            }

           else{
            const user = await User.findOne({ userName })
            if (user) {

                return res.status(400).json({
                    message: 'User already exists'
                })
            }

            //encrypting password
    
            const salt = await bcrypt.genSalt(10)
            const hashedPasword =await bcrypt.hash(password, salt)
            
            const newUser = new User({
                userName,
                role,
                originalPassword:password,
                password: hashedPasword,
            })
            await newUser.save()
              // creating a token
         const token=createToken(newUser._id)
         res.status(200).json({message:` ${userName} Registered as ${role}!`})
          
           }
        }

        else{
        res.status(400).json({message:'Invalid Company Code'})
        }
       
        
    } 

    catch (error) {
        res.status(500).json({message:error.message})
    }
}


// Login User Controller

const loginUser = async (req,res) => {
    
    try {
        const { userName, password } = req.body
  let emptyFields = []

        if (!userName) {
    emptyFields.push('userName')
        }
        if (!password) {
    emptyFields.push('password')
      
    }
      if(emptyFields.length > 0) {
          return res.status(400).json({ message: 'Please fill in all the fields', emptyFields })
        }

        const user = await User.findOne({userName})
        if (!user) {
            res.status(400).json({ message: "Account not Found" })
        }
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = createToken(user._id)
                const userName=user.userName
                const role=user.role
                res.status(200).json({
                    message: `Welcome ${user.userName} to Rozgar TTTC`,
                    token,userName,role
                })
            } else {
                res.status(400).json({ message: "Invalid Password" })
            }
        }
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

// get Users
const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

       
if(user){
    res.status(200).json({ data: user });

}

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser=async(req,res)=>{

    try {
       
        const userId=req.user._id
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if(user){
            const {userName,role,originalPassword}=req.body
            let hashedPasword
            if(originalPassword){
              
                //encrypting password
    
            const salt = await bcrypt.genSalt(10)
             hashedPasword =await bcrypt.hash(originalPassword, salt)
            }
            user.userName=userName,
            user.role=role,
            user.originalPassword=originalPassword,
            user.password=hashedPasword
            await user.save()
            res.status(200).json({message:"Profile updated successfuly!"})
        }
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }
}

// Update User
module.exports={signupUser,loginUser,getAllUsers,updateUser}