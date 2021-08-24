var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async (req, res, next)=> {
  console.log(req.session);
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
  const error = req.flash('info')[0];
  console.log(error);
  res.render('login',{error});
})

router.post('/login', async (req,res,next)=>{
  const  {email,password} =  req.body;
  try{
    if(!email || !password){
      req.flash('info','Email/Password required');
      return res.redirect('/users/login');
    }
    const user = await User.findOne({email : email});
    if(! user){
      req.flash('info','Email is not registered');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password,(err,result)=> {
      console.log(err,result);
      if(err) return next(err);
      if(!result){  
        req.flash('info','Password is in-correct');
        return res.redirect('/users/login');
      }
      // persist user info and create a session
      req.session.userId = user.id;
      res.redirect('/users');
       
    })

  }
  catch(err){
    return next(err);
  }
})

router.get('/logout', async (req,res,next)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
})  
module.exports = router;
