const db = require("../models");
const Status = db.statuses;
const Op = require("sequelize").Op;

// Create and save a new Status
exports.create = (req, res) => {
  if (!req.body.title || req.body.title.length === 0) {
    res.status(400).send({
      message: "Status should have a title!",
    });
    return;
  }

  const status = { title: req.body.title };

  Status.create(status)
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Status could not be created.",
      });
    });
};

// Get All Statuses from database
// Get all Statuses from database that contain a substring in their title
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Status.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Could not retrieve statuses.'
      })
    })
};

// Get a Status By Id from database
exports.findOne = (req, res) => {
  const id = req.params.id;

  Status.findByPk(id)
    .then(data => {
      if (data) res.send(data);

      res.status(400).send({
        message: `Cannot find Status with id=${id}`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieving Status with id=${id}`
      })
    })
};

// Update a Status By Id from database
exports.update = (req, res) => {
  const id = req.params.id;

  if (!req.body.title || req.body.title.length === 0) {
    res.status(400).send({
      message: "Status should have a title!",
    });
    return;
  }

  Status.update({title: req.body.title }, {
    where: { id: id }
  })
    .then(num => {
      const message = num[0] === 1 ?
       'Status was updated successfully.'
       : `Cannot update Status with id=${id}.`;
      res.send({ message });
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Status with id=${id}.`
      })
    })
};

// Delete a Status By Id
exports.delete = (req, res) => {
  const id  = req.params.id;

  Status.destroy({
    where: { id: id }
  })
  .then(num => {
    const message = num === 1 ?
     'Status was deleted successfully.'
     : `Cannot delete Status with id=${id}.`;
    res.send({ message });
  })
  .catch(err => {
    res.status(500).send({
      message: `Error deleting Status with id=${id}.`
    })
  })
};
