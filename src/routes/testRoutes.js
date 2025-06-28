// src/routes/testRoutes.js
const express = require('express');
const { createTest, fetchTests } = require('../controllers/testController.js');
const { addQuestionToTest, getQuestionsByTestId } = require('../controllers/questionController');
const {addTestResult, getTestResults, getLeaderBoard} = require('../controllers/testResultController.js');
const {TeacherSignup , TeacherLogin} = require('../controllers/TeacherControllers.js');
const { protect } = require('../middleware/authMiddleware');
module.exports = function(io) {
  const router = express.Router();
  const { sendQuestions } = require('../controllers/liveTestController.js')(io);

  // Public Routes
  router.post('/teacher/signup', TeacherSignup);
  router.post('/teacher/login', TeacherLogin);
  
  // Protected Routes
  router.use(protect); // All routes after this will be protected
  
  // Test Routes
  router.post('/test', createTest);
  router.post('/fetchTest', fetchTests);
  router.post('/add-question', addQuestionToTest);
  router.post('/fetch-test-questions', getQuestionsByTestId);
  router.post('/live-test', sendQuestions);
  router.post('/add-result', addTestResult);
  router.post('/get-results', getTestResults);
  router.post('/get-leaderboard', getLeaderBoard);

  return router;
};
