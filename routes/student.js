const express = require('express');
const router = express.Router();
const db = require('../config/db');

function inRange(start, end){
  const now = new Date();
  const current = now.getHours() + now.getMinutes()/60;
  return current >= start && current <= end;
}

const schoolLat = 6.5244;
const schoolLong = 3.3792;
const radius = 0.01; // 1km radius

function distance(lat1, lon1, lat2, lon2){
  return Math.sqrt(Math.pow(lat1-lat2,2) + Math.pow(lon1-lon2,2));
}

// Arrival
router.post('/arrival', (req,res)=>{
  const { student_id, lat, long } = req.body;
  if(!inRange(7,10)) return res.json({error:'Arrival only 7-10AM'});
  if(distance(lat,long,schoolLat,schoolLong) > radius) return res.json({error:'Not in school premises'});

  const today = new Date().toISOString().slice(0,10);
  db.query('SELECT * FROM attendance WHERE student_id=? AND date=?', [student_id,today], (err,rows)=>{
    if(rows.length>0) return res.json({error:'Arrival already marked'});
    db.query('INSERT INTO attendance (student_id,date,time_in,latitude,longitude) VALUES (?,?,?,?,?)', 
      [student_id,today,new Date().toTimeString().split(' ')[0],lat,long], 
      ()=>res.json({success:'Arrival recorded'})
    );
  });
});

// Departure
router.post('/departure', (req,res)=>{
  const { student_id, lat, long } = req.body;
  if(!inRange(15,16)) return res.json({error:'Departure only 3-4PM'});
  if(distance(lat,long,schoolLat,schoolLong) > radius) return res.json({error:'Not in school premises'});

  const today = new Date().toISOString().slice(0,10);
  db.query('UPDATE attendance SET time_out=CURTIME() WHERE student_id=? AND date=?',
    [student_id,today],
    ()=>res.json({success:'Departure recorded'})
  );
});

module.exports = router;
