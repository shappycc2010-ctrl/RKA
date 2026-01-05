const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Teacher / Parent / Admin login
router.post('/login', (req,res)=>{
  const { email, password, role } = req.body;

  db.query('SELECT * FROM users WHERE email=? AND role=?', [email, role], (err, results)=>{
    if(err) return res.json({error: 'Database error'});
    if(results.length === 0) return res.json({error:'User not found'});

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match)=>{
      if(match) return res.json({success:'Login successful', user});
      else return res.json({error:'Incorrect password'});
    });
  });
});

// Optional: register new teacher/parent/admin
router.post('/register', async (req,res)=>{
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
    [name,email,hashed,role],
    (err)=> {
      if(err) return res.json({error:'Error creating user'});
      return res.json({success:'User created successfully'});
    });
});

module.exports = router;
