import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


let hashPassword = async(password)=>{
    const salt= await bcrypt.genSalt(10) /*10 - is the value how many time shuffle */ 
    const hash= await bcrypt.hash(password,salt) /*hash the input password retrun the hash value */ 
    return hash 
}

let hashCompare= async(password,hash)=>{
    console.log(password,hash)
      return   await bcrypt.compare(password,hash)
      /* Check the user password to database already exists password are same with this function */
}

let createtoken = async(payload)=>{
    let token =await jwt.sign(payload,process.env.JWT_SECRET,{ 
        expiresIn:process.env.JWT_EXPIRE
    })
    return token 
    /* create token, give arugument payload, secretkey, expire time */ 
}

let decodeToken = async (token)=>{
    return await jwt.decode(token)
    /* decode -> it return object (concept- teach middleware)*/
}





export default {
    hashPassword,
    hashCompare,
    createtoken,
    decodeToken
}