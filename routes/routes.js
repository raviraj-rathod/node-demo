const express = require('express')
const jwt = require('jsonwebtoken');
const secret = 'secretKey'

const router = express.Router()

module.exports = router;


const todoRoutes = require('./todos.js')
router.use('/todos', verifyToken, todoRoutes)

const fileRoutes = require('./profile.js')
router.use('/profile', verifyToken, fileRoutes)

const authRoutes = require('./auth.js')
router.use('/auth', authRoutes)

async function verifyToken(req, res, next) {
  // const bearerHeader = req.headers['Authorization']
  // if (bearerHeader !== undefined &&  bearerHeader !== null){
  //   const token = bearerHeader.split(' ')[1]
  //   await jwt.verify(token, secret,(err,authData))
  //   if(err){
  //     res.status(401).send('token Expired')
  //   }
  next();

  // }else{
  //   console.log("trez");
  //  res.status(402).send('Unauthorized')
  // }

}

router.get('/', (req, res) => {
  res.send('Welcome to the main route');
});