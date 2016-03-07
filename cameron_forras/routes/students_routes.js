const express = require('express');
const jsonParser = require('body-parser').json();
const Student = require(__dirname + '/../models/student');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var studentRouter = module.exports = exports = express.Router();

studentRouter.get('/students', (req, res) => {
  Student.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

studentRouter.post('/students', jsonParser, (req, res) => {
  var newStudent = new Student(req.body);
  newStudent.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

studentRouter.put('/students/:id', jsonParser, (req, res) => {
  var studentData = req.body;
  delete studentData._id;
  Student.update({_id: req.params.id}, studentData, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({msg: 'success'});
  });
});


studentRouter.delete('/students/:id', (req, res) => {
  Student.remove({_id: req.params.id}, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({msg: 'success'});
  });
});
