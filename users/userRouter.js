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

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id }
  postDb.insert(postInfo)
    .then(post => {
      res.status(210).json(post)
    })
    .then(error => {
      res.status(500).json({
        error: `Error adding post ${error.message}`
      })
    })
})

router.get('/', (req, res) => {
  userDb.get(req.body)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({
        error: `Error fetching users ${error.message}`
      });
    });
});


router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {

  userDb.getUserPosts(req.user.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    res.status(500).json({
      error: `Error fetching posts ${error.message}`
    });
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.user.id)
  .then(() => {
    res.status(200).json({
      message: "This user has been deleted"
    })
  })
  .catch(error => {
    res.status(500).json({
      error: `Error removing the user ${error.message}`
    })
  })
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  userDb.update(req.user.id, req.body)
  .then(updatedUser => {
    res.status(200).json(updatedUser)
  })
  .catch(error => {
    res.status(500).json({
      error: `Error updating user ${error}`
    });
  });
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
  if (Object.keys(req.body).length) {
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
  if (!Object.keys(req.body).length) {
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
