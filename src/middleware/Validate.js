import userModel from '../model/user.js'
import Auth from '../utils/auth.js'

const Validate = async(req,res,next)=>{
    try{
        let token = req?.headers?.authorization?.split(" ")[1]  /* token from the header of the  url & get and split the 2 one of the authorization */
        // Token validate
        if(token){
            let payload = await Auth.decodeToken(token)

            let userData= await userModel.findById(payload.id)
            if(Math.round(+new Date()/1000)<payload.exp && userData.role === payload.role){ 
                    next()
                     /* To check the db data findone userData & check if same payload value and next()
                     Math.round(+new Date()/1000)<payload.exp - check the future the exipire value and current time / 
                     if currenct time lesser than give next otherwise token expired

                     userData.role === payload.role - it is solution for highjacking the console pannel edit token jwt 
                     check the payload input role and database  role 
                     */
            }
            else{
                res.status(402).send({message:"Token expired"})
            }
        }
        else{
            res.status(402).send({message:"Token Not found"})
        }
    }
    catch(error){
        res.status(500).send({
            message:"Internal server error",
            error:error.message
        })
    }
}


export default Validate