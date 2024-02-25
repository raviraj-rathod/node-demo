const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret = 'secretKey';
router.post('/login', (req, res) => {
  let user = {
    name:'Raviraj Rathod',
    id:1,
  }
  jwt.sign({ user },secret,{expiresIn:'30s'},(err,token)=>{
    if(err){
      res.status(400).send('Login fail')
    }
    res.json({
      token
    })
  })
  res.send('login Get successfully');
});

module.exports = router;