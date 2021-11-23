require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const db = require('./app/models/index');

const app = express();

const corsOptions = {
  origin: process.env.CORS_OPTIONS_ORIGIN
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: 'React Organizer API'});
});

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// Require routes
require('./app/routes/status.routes')(app);
require('./app/routes/task.routes')(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});