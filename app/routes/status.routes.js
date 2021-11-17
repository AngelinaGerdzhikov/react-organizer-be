const statuses = require('../controllers/status.controller');
const router = require('express').Router();

module.exports = app => {
  // Create a Status
  router.post('/', statuses.create);

  // Retrieve all Statuses
  router.get("/", statuses.findAll);

  // Retrieve a single Status with id
  router.get("/:id", statuses.findOne);

  // Update a Status with id
  router.put("/:id", statuses.update);

  // Delete a Status with id
  router.delete("/:id", statuses.delete);

  app.use('/api/statuses', router);
}