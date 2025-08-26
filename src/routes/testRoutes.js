// src/routes/testRoutes.js
const express = require('express');
const { createTest, fetchTests, fetchTestByTeacherID, fetchTestDetails } = require('../controllers/testController.js');
const { addQuestionToTest, getQuestionsByTestId, updateQuestions } = require('../controllers/questionController');
const { addTestResult, getTestResults, getLeaderBoard, getLiveLeaderBoard, getTestResultsDetailed } = require('../controllers/testResultController.js');
const { TeacherSignup, TeacherLogin, TeacherLogout } = require('../controllers/TeacherControllers.js');
const { StudentSignup, StudentLogin, StudentLogout, studentDetailsById, fetchStudentTests, fetchStudentTestsWithPerformance } = require('../controllers/StudentController.js');
const { sendOTP, verifyOTP } = require('../controllers/authVerify/OtpControllers.js')


const { protect } = require('../middleware/authMiddleware');
const { protectStudent } = require('../middleware/authStudentMiddleware');
module.exports = function (io) {
  const router = express.Router();
  const { sendQuestions } = require('../controllers/liveTestController.js')(io);

  router.post('/send-otp', sendOTP);
  router.post('/verify-otp', verifyOTP);
  // Public Routes
  router.post('/teacher/signup', TeacherSignup);
  router.post('/teacher/login', TeacherLogin);
  router.post('/teacher/logout', TeacherLogout);
  router.post('/student/signup', StudentSignup);
  router.post('/student/login', StudentLogin);
  router.post('/student/logout', StudentLogout);
  // Protected Routes
  // router.use(protect); // All routes after this will be protected

  // Test Routes
  router.post('/test', protect, createTest);
  router.post('/fetchTest', protect, fetchTests);
  router.post('/add-question', protect, addQuestionToTest);
  router.post('/update-questions', protect, updateQuestions);
  router.post('/fetch-test-questions', protect, getQuestionsByTestId);
  router.post('/live-test', protect, sendQuestions);

  router.post('/get-teacher-tests', protect, fetchTestByTeacherID)
  router.post('/get-test', protect, fetchTestDetails)

  router.post('/add-result', protectStudent, addTestResult);
  router.post('/get-results', protectStudent, getTestResults);
  router.post('/get-leaderboard', protectStudent, getLeaderBoard);
  router.post('/get-live-leaderboard', protectStudent, getLiveLeaderBoard)
  router.post('/get-student-tests', protectStudent, fetchStudentTests)
  router.post('/get-student-tests-with-performance', protectStudent, fetchStudentTestsWithPerformance)
  router.post('/get-test-results-detailed', protectStudent, getTestResultsDetailed);
  router.post('/get-student-detail', protectStudent, studentDetailsById);
  router.use(protectStudent); // All routes after this will be for student to pass through middleware

  return router;
};
