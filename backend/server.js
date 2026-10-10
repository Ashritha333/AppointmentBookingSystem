const fs = require('fs');
const path = require('path');

fs.mkdirSync(path.join(__dirname, '..', 'data'), { recursive: true });
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Appointment Booking System running at http://localhost:${PORT}`);
});
