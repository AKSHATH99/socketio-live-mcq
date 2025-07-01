// src/controllers/testController.js
const { prisma } = require('../lib/prisma');

module.exports.createTest = async (req, res) => {
  try {
    console.log("hooo")
    const { title, description , teacherId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const test = await prisma.test.create({
      data: {
        title,
        description,
        teacherId
      },
    });

    return res.status(201).json(test);
  } catch (err) {
    console.error('Error creating test:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.fetchTests = async (req, res) => {
  try {
    // const { id } = req.body;

    // if (!id) {
    //   // return res.status(400).json({ error: ' id is required' });
    // }
    const tests = await prisma.test.findMany();

    return res.status(201).json(tests)
  } catch (error) {

    console.error('Error fetching tests:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.fetchTestByTeacherID = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const tests = await prisma.test.findMany({
      where: {
        teacherId: id
      }
    });

    return res.status(201).json(tests)
  } catch (error) {
    console.error('Error creating test:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.fetchTestDetails = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const test = await prisma.test.findUnique({
      where: {
        id
      }
    });

    return res.status(201).json(test)
  } catch (error) {
    console.error('Error fetching test details:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}