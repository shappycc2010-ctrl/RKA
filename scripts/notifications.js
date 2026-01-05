const db = require('../config/db');

// Send notification to a user
function sendNotification(user_id, message) {
  db.query(
    'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
    [user_id, message],
    (err) => {
      if (err) console.error('Notification error:', err);
      else console.log(`Notification sent to user ${user_id}: ${message}`);
    }
  );
}

// Get all notifications for a user
function getNotifications(user_id, callback) {
  db.query(
    'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC',
    [user_id],
    (err, results) => {
      if (err) {
        console.error('Get notifications error:', err);
        callback([]);
      } else {
        callback(results);
      }
    }
  );
}

// Mark a notification as read
function markAsRead(notification_id) {
  db.query(
    'UPDATE notifications SET read_status="read" WHERE id=?',
    [notification_id],
    (err) => {
      if (err) console.error('Mark as read error:', err);
      else console.log(`Notification ${notification_id} marked as read`);
    }
  );
}

// Example usage:

// 1️⃣ Student arrives → notify parent
function studentArrival(student_id, parent_id) {
  const message = `Your child with ID ${student_id} has arrived at school.`;
  sendNotification(parent_id, message);
}

// 2️⃣ Student departs → notify parent
function studentDeparture(student_id, parent_id) {
  const message = `Your child with ID ${student_id} has left school.`;
  sendNotification(parent_id, message);
}

// 3️⃣ Parent submits opinion → notify teacher/admin
function parentOpinion(parent_name, teacher_id) {
  const message = `${parent_name} submitted a new opinion.`;
  sendNotification(teacher_id, message);
}

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  studentArrival,
  studentDeparture,
  parentOpinion
};
