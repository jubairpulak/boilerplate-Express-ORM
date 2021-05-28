
const jwt = require("jsonwebtoken")

const config = require("../config");
const {token_Secret, token_Expires} = config.token
exports.createToken = (userid, req, res) =>{
    const token = jwt.sign({userid}, token_Secret, {
        expiresIn : token_Expires
    })

    const cookieOptions = {
        expires : new Date(
            Date.now() + token_Expires * 24 * 60 *60 *1000

        ),
        httpOnly : true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'

    }

    if(process.env.NODE_ENV  === 'production') cookieOptions.secure = true
    res.cookie('jwt', token, cookieOptions)
    return token
}