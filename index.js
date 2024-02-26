const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json())

mongoose.connect(`mongodb+srv://omarcory2:${process.env.DB_PASS}@cluster0.newjehu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

const salt = bcrypt.genSaltSync(10);

app.post('/register', async (req,res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.status(200).json({id: userDoc._id, username: userDoc.username});
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.findOne({username});
        if(userDoc) {
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if(!passOk) {
                return res.status(401).json("Wrong credentials");
            }
            return res.status(200).json({id: userDoc._id, username: userDoc.username});
        }
        else {
            return res.status(401).json("User not found");
        }
    } catch (error) {
        return res.status(400).json(error);
    }
});

app.listen(4444);