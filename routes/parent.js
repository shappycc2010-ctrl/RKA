const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Submit opinion
router.post('/opinion', (req,res)=>{
  const { parent_id, category, message } = req.body;
  db.query('INSERT INTO opinions (parent_id, category, message) VALUES (?,?,?)', 
    [parent_id, category, message], (err)=>{
      if(err) return res.json({error:'DB error'});
      return res.json({success:'Opinion submitted'});
    });
});

// Get all messages for parent
router.get('/messages/:parent_id', (req,res)=>{
  const parent_id = req.params.parent_id;
  db.query('SELECT * FROM chat WHERE receiver_id=? OR sender_id=? ORDER BY created_at ASC', 
    [parent_id,parent_id], (err, rows)=>{
      if(err) return res.json({error:'DB error'});
      return res.json(rows);
    });
});

// Send message to teacher
router.post('/message', (req,res)=>{
  const { sender_id, receiver_id, message } = req.body;
  db.query('INSERT INTO chat (sender_id, receiver_id, message) VALUES (?,?,?)', 
    [sender_id, receiver_id, message], (err)=>{
      if(err) return res.json({error:'DB error'});
      return res.json({success:'Message sent'});
    });
});

module.exports = router;
