var express = require('express');
const connect = require('./config/db');
const { userRoute } = require('./routes/user');
const GoogleRouter = require('./routes/authenticate')
var app = express();

app.use(express.json());


app.use(passport.initialize());

app.use('/google' ,  GoogleRouter)
app.use('/user' , userRoute)


app.get('/' , (req , res)=>{
    res.send('welcome to tummoc test api')
})



app.listen(8080 , async()=>{
    try {
        await connect();
        console.log('listening on port http://localhost:8080')
    } catch (error) {
        console.log(error)
    }
})
