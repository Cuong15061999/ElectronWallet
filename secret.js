module.exports = {
    cookieSecret: 'abc123$',
    sessionSecret:{ secret: 'ses123$',
    resave: true,
    maxAge: 2592000000,
    saveUninitialized: true},
    mongo:{
        dev:{
            conn:"mongodb://127.0.0.1:27017/cuoiki"
        },
        product:{
            conn:"mongodb://127.0.0.1:27017/cuoiki"
        },  
   }
}
