import {Response,Request } from 'express';
import  Express  from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes';
const app=Express();

app.use(Express.json());
app.use(cors());
app.use('/api/auth',authRoutes);

app.get('/',(req:Request,res:Response)=>{
  res.send("hello world");
});

app.use((err:Error,req:Express.Request,res:Express.Response,next:Express.NextFunction)=>{
  console.error(err.stack);
  res.status(500).send('something broke');
});
export default app;
