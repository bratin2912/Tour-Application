import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/user.js'

dotenv.config();

const PORT=5000 || process.env.PORT;

const app=express();

app.use(cors());
app.use(express.json({limit:"30mb",extended:true}));
app.use(cors());

app.use('/user',userRouter)

mongoose.connect(process.env.MNONGO_URL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`App is running on PORT No.${PORT}`);
    })
})
.catch(err=>{
    console.log(err)
})