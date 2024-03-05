var jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const fetchuser = (req,res, next)=>{

    const authtoken = req.header("auth-token");

    if(!authtoken){
        res.status(401).send({error:"Please authenticate using a valid auth token"})
    }
    
    try{
        const data = jwt.verify(authtoken,jwtSecret);
        req.user = data.user;
        next();
    }catch(error){
        res.status(401).send({error:"Please authenticate using a valid auth token catch"})
    }
}

module.exports = fetchuser;