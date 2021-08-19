var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async (req, res, next)=> {
  res.render('users');
});

router.get('/register', async (req,res,next)=> {
  res.render('register');
})
router.post('/register', async (req,res,next)=> {
  console.log(req.body);
  try{
    const user = await User.create(req.body);
    res.redirect('/users/login');
  }
  catch(error){
    next(error);
  }
})

router.get('/login', async (req,res,next)=>{
  res.render('login');
})

router.post('/login', async (req,res,next)=>{
  const  {email,password} =  req.body;
  try{
    if(!email || !password){
      res.redirect('/users/login');
    }
    const user = await User.findOne({email : email});
    if(! user){
      res.redirect('users/login');
    }
    user.verifyPassword(password,(err,result)=> {
      console.log(err,result);
      if(err) return next(err);
      if(!result){
        res.redirect('/users/login');
      } 
    })

  }
  catch(err){
    return next(err);
  }
})
module.exports = router;
