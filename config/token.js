module.exports ={
    token_Secret : process.env.My_TOKEN_SECRET ,
    token_Expires : process.env.NODE_ENV.startsWith("d") ? process.env.TOKEN_EXPIRES : '2d' 
}