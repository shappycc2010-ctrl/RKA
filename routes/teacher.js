const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all messages for teacher
router.get('/messages/:teacher_id', (req,res)=>{
  const teacher_id = req.params.teacher_id;
  db.query('SELECT * FROM chat WHERE receiver_id=? OR sender_id=? ORDER BY created_at ASC', 
    [teacher_id, teacher_id], (err, rows)=>{
      if(err) return res.json({error:'DB error'});
      return res.json(rows);
    });
});

// Reply to parent
router.post('/message', (req,res)=>{
  const { sender_id, receiver_id, message } = req.body;
  db.query('INSERT INTO chat (sender_id, receiver_id, message) VALUES (?,?,?)', 
    [sender_id, receiver_id, message], (err)=>{
      if(err) return res.json({error:'DB error'});
      return res.json({success:'Message sent'});
    });
});

// View parent opinions
router.get('/opinions', (req,res)=>{
  db.query('SELECT opinions.*, users.name AS parent_name FROM opinions JOIN users ON opinions.parent_id = users.id ORDER BY created_at DESC', 
    (err, rows)=>{
      if(err) return res.json({error:'DB error'});
      return res.json(rows);
    });
});

// Update opinion status
router.post('/opinions/:id/status', (req,res)=>{
  const { status } = req.body;
  const id = req.params.id;
  db.query('UPDATE opinions SET status=? WHERE id=?', [status,id], (err)=>{
    if(err) return res.json({error:'DB error'});
    return res.json({success:'Status updated'});
  });
});

module.exports = router;
