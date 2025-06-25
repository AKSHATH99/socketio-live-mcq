// src/routes/testRoutes.js
const express = require('express');
const { createTest } = require('../controllers/testController.js');
const {fetchTests} = require('../controllers/testController.js')
const { addQuestionToTest,getQuestionsByTestId  } = require('../controllers/questionController');
// const 


const router = express.Router();

// POST /api/test
router.post('/test', createTest);
router.post('/fetchTest', fetchTests);
router.post('/add-question', addQuestionToTest);
router.post('/fetch-test-questions', getQuestionsByTestId);

// FETCH THIS IN FRONTEND , THEN DESIGN API TO SEND QUESITONS TO SOCKET  ----------NEXT !!!!!!!!!!!!!!!!!!!!!!!!!
module.exports = router;
