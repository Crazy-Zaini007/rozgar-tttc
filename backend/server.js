const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const http = require('http');
const cors = require('cors');
//express app
const app = express()
const server = http.createServer(app)

app.use(cors());

//set the limit to 100MB for request
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//PORT number
const PORT = process.env.PORT

//connect to mongoDB
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 50000 })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Connected on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

