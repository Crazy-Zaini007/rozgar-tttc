const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const http = require('http');
const cors = require('cors');

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

