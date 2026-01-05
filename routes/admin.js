const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create teacher/parent
router.post('/create-user', (req,res)=>{
  const { name, email, password, role } = req.body;
  const bcrypt = require('bcrypt');
  bcrypt.hash(password, 10, (err, hashed)=>{
    db.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', 
      [name,email,hashed,role], (err)=>{
        if(err) return res.json({error:'DB error'});
        return res.json({success:'User created'});
      });
  });
});

// View all students
router.get('/students', (req,res)=>{
  db.query('SELECT * FROM students', (err,rows)=>{
    if(err) return res.json({error:'DB error'});
    return res.json(rows);
  });
});

// View attendance logs
router.get('/attendance', (req,res)=>{
  db.query('SELECT * FROM attendance ORDER BY date DESC', (err,rows)=>{
    if(err) return res.json({error:'DB error'});
    return res.json(rows);
  });
});

// Analytics example: attendance % per day
router.get('/analytics', (req,res)=>{
  db.query('SELECT date, COUNT(*) AS present FROM attendance GROUP BY date', (err,rows)=>{
    if(err) return res.json({error:'DB error'});
    return res.json(rows);
  });
});

module.exports = router;
