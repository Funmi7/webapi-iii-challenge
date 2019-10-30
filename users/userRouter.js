const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  userDb.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error => {
    res.status(500).json({
      error: `Error adding the user ${error.message}`
    });
  });
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
  userDb.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          message: "invalid user id"
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        error: `Can't load the user id ${error.message}`
      })
    })
};

function validateUser(req, res, next) {
 if(Object.keys(req.body).length) {
   next();
 } else if (!req.body.name) {
   res.status(400).json({
    message: "missing required name field"
   })
 }
 else {
   res.status(400).json({
    message: "missing user data"
   })
 }

};

function validatePost(req, res, next) {
if(!Object.keys(req.body).length) {
  res.status(400).json({
    message: "missing post data"
  })
} else if (!req.body.text) {
  res.status(400).json({
    message: "missing required text field"
  })
} else {
  next();
}
};

module.exports = router;
