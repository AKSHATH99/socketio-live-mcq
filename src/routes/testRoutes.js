// src/routes/testRoutes.js
const express = require('express');
const { createTest, fetchTests } = require('../controllers/testController.js');
const { addQuestionToTest, getQuestionsByTestId } = require('../controllers/questionController');
const {addTestResult, getTestResults, getLeaderBoard , getLiveLeaderBoard} = require('../controllers/testResultController.js');
const {TeacherSignup , TeacherLogin} = require('../controllers/TeacherControllers.js');
const {StudentSignup , StudentLogin} = require('../controllers/StudentController.js');
const {sendOTP, verifyOTP} = require('../controllers/authVerify/OtpControllers.js')


const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/authStudentMiddleware');
module.exports = function(io) {
  const router = express.Router();
  const { sendQuestions } = require('../controllers/liveTestController.js')(io);

  router.post('/send-otp', sendOTP);
  router.post('/verify-otp', verifyOTP);
  // Public Routes
  router.post('/teacher/signup', TeacherSignup);
  router.post('/teacher/login', TeacherLogin);
  router.post('/student/signup', StudentSignup);
  router.post('/student/login', StudentLogin); 
  // Protected Routes
  // router.use(protect); // All routes after this will be protected
  
  // Test Routes
  router.post('/test', createTest);
  router.post('/fetchTest', fetchTests);
  router.post('/add-question', addQuestionToTest);
  router.post('/fetch-test-questions', getQuestionsByTestId);
  router.post('/live-test', sendQuestions);
  router.post('/add-result', addTestResult);
  router.post('/get-results', getTestResults);
  router.post('/get-leaderboard', getLeaderBoard);
  router.post('/get-live-leaderboard', getLiveLeaderBoard)

  router.use(protectStudent); // All routes after this will be for student to pass through middleware
  

  return router;
};
