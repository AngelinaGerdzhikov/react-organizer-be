const tasks = require('../controllers/task.controller');
const router = require('express').Router();

module.exports = app => {
  // Get all Tasks from database for a given week of year
  router.get('/year/:year/week/:week', tasks.findAllTasksByWeek);

  // Get all Tasks from database for a given month of year
  router.get('/year/:year/month/:month', tasks.findAllTasksByMonth);

  // Get all Tasks from database
  router.get('/', tasks.findAll);

  // Get a single Task with id
  router.get("/:id", tasks.findOne);

  // Create a Task
  router.post('/', tasks.create);

  // Update a Task with id
  router.put("/:id", tasks.update);
  
  // Delete a Task with id
  router.delete("/:id", tasks.delete);

  app.use('/api/tasks', router);
};