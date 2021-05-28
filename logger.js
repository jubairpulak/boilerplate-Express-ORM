const pino = require('Pino')

const logger = pino({
    level : process.env.NODE_ENV == 'production' ?  'info' : 'debug'
})



module.exports.logger = logger
