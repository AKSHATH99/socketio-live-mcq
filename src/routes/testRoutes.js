// src/routes/testRoutes.js
const express = require('express');
const { createTest, fetchTests } = require('../controllers/testController.js');
const { addQuestionToTest, getQuestionsByTestId } = require('../controllers/questionController');

module.exports = function(io) {
  const router = express.Router();
  const { sendQuestions } = require('../controllers/liveTestController.js')(io);

  router.post('/test', createTest);
  router.post('/fetchTest', fetchTests);
  router.post('/add-question', addQuestionToTest);
  router.post('/fetch-test-questions', getQuestionsByTestId);
  router.post('/live-test', sendQuestions);

  return router;
};
