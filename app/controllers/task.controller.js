const db = require('../models');
const Task = db.tasks;
const Status = db.statuses;
const Op = require("sequelize").Op;

// Get all Tasks from database
// Get all Tasks from database that contain a substring in their title
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  
  Task.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Could not retrieve tasks.'
      })
    })
};

// Get all Tasks from database for a given month of year
exports.findAllTasksByMonth = (req, res) => {
  const year = req.params.year;
  const month = req.params.month;

  Task.findAll({ 
    attributes: { exclude: ['status_id'] },
    where: 
      db.sequelize.and(
        db.sequelize.where(
          db.sequelize.fn('YEAR', db.sequelize.col('due_date')), +year
        )
      ,
        db.sequelize.where(
          db.sequelize.fn('MONTH', db.sequelize.col('due_date')), +month
        )
      ),
    include: [ { model: db.statuses, as: 'status' }]     
  })
  .then(data => res.send(data))
  .catch(err => {
    res.status(500).send({
      message: err.message || 'Could not retrieve tasks.'
    })
  })
};

// Get all Tasks from database for a given week of year
exports.findAllTasksByWeek = (req, res) => {
  const year = req.params.year;
  const week = req.params.week;

  Task.findAll({ 
    attributes: { exclude: ['status_id'] },
    where: db.sequelize.where(
      db.sequelize.fn('YEARWEEK', db.sequelize.col('due_date')), `${year}${week}`
    ),
    include: [ { model: db.statuses, as: 'status' }]
  })
  .then(data => res.send(data))
  .catch(err => {
    res.status(500).send({
      message: err.message || 'Could not retrieve tasks.'
    })
  })
};

// Get a Task by ID from database
exports.findOne = (req, res) => {
  const id = req.params.id;

  Task.findByPk(id)
    .then(data => {
      if (data) res.send(data);

      res.status(400).send({
        message: `Cannot find Task with id=${id}`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Task with id=${id}`
      })
    })
};

// Create and save a new Task
exports.create = (req, res) => {
  const { title, description, due_date, status_id } = req.body; 
  
  if (!title || title.length === 0 || !due_date) {
    res.status(400).send({
      message: 'Task is missing required fields.'
    });
    return;
  }

  Status.findAll({ where: { title: { [Op.like]: `%TO_DO%` } }})
    .then(data => {
      const toDoStatusId = data[0].id;
      return toDoStatusId;
    })
    .then(toDostatusId => {
      const task = {
        title, 
        description: description || '',
        due_date,
        status_id: status_id || toDostatusId
      };

      return Task.create(task);
    })
    .then((data) => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Task could not be created.",
      });
    })
}

// Update a Task By Id from database
exports.update = (req, res) => {
  const id = req.params.id;
  const { title, description, due_date, status_id } = req.body; 

  // if (!req.body.title || req.body.title.length === 0) {
  //   res.status(400).send({
  //     message: "Status should have a title!",
  //   });
  //   return;
  // }

  Task.findByPk(id)
    .then(data => {
      if (data) {
        const {prevTitle, prevDescription, prevDueDate, prevStatusId } = data;
        
        return Task.update({
          title: title || prevTitle, 
          description: description || prevDescription || '',
          due_date: due_date || prevDueDate,
          status_id: status_id || prevStatusId
        }, {
          where: { id: id }
        })
      }
    })
    .then(num => {
      const message = num[0] === 1 ?
        'Task was updated successfully.'
        : `Cannot update Task with id=${id}.`;
      res.send({ message });
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Task with id=${id}.`
      })
    })
};

// Delete a Task By Id
exports.delete = (req, res) => {
  const id  = req.params.id;

  Task.destroy({
    where: { id: id }
  })
  .then(num => {
    const message = num === 1 ?
     'Task was deleted successfully.'
     : `Cannot delete Task with id=${id}.`;
    res.send({ message });
  })
  .catch(err => {
    res.status(500).send({
      message: `Error deleting Task with id=${id}.`
    })
  })
};
