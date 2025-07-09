
const { prisma } = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};
module.exports.StudentSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAccount = await prisma.student.findUnique({
            where: {
                email
            }
        });
        if (existingAccount) {
            return res.status(400).json({ message: "Account already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const student = await prisma.student.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const { password: _, ...studentWithoutPassword } = student;
        const token = generateToken(student.id);

        // Set HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(201).json({
            message: "Student created and logged in successfully",
            student: studentWithoutPassword,
            token: token
        });
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports.StudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const student = await prisma.student.findUnique({
            where: {
                email
            }
        });
        if (!student) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const { password: _, ...studentWithoutPassword } = student;
        const token = generateToken(student.id);

        // Set HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({
            message: "Student logged in successfully",
            student: studentWithoutPassword,
            token: token
        });
    } catch (error) {
        console.error('Error logging in student:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


module.exports.studentDetailsById = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const student = await prisma.student.findUnique({
            where: {
                id
            }
        });
        if (!student) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { password: _, ...studentWithoutPassword } = student;
        return res.status(200).json({
            message: "Student details fetched successfully",
            student: studentWithoutPassword
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports.fetchStudentTests = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Method 1: Using distinct to get unique test IDs, then fetch full test details
        const studentTests = await prisma.testResult.findMany({
            where: {
                studentId: id
            },
            select: {
                testId: true,
                test: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        teacherId: true,
                        teacher: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            distinct: ['testId'], // This ensures we get unique test IDs only
            orderBy: {
                timestamp: 'desc' // Most recently attended tests first
            }
        });

        if (!studentTests || studentTests.length === 0) {
            return res.status(404).json({ message: "No tests found for this student" });
        }

        // Extract just the test details (removing the testId wrapper)
        const tests = studentTests.map(result => result.test);

        return res.status(200).json({
            message: "Tests fetched successfully",
            tests: tests,
            count: tests.length
        });

    } catch (error) {
        console.error('Error fetching student tests:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports.fetchStudentTestsWithPerformance = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Step 1: Fetch all results for the student
    const results = await prisma.testResult.findMany({
      where: { studentId: id },
      select: {
        testId: true,
        isCorrect: true
      }
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No test results found" });
    }

    // Step 2: Group results by testId and calculate performance
    const performanceByTest = {};
    for (const result of results) {
      const testId = result.testId;
      if (!performanceByTest[testId]) {
        performanceByTest[testId] = {
          total: 0,
          correct: 0
        };
      }
      performanceByTest[testId].total++;
      if (result.isCorrect) {
        performanceByTest[testId].correct++;
      }
    }

    const testIds = Object.keys(performanceByTest);

    // Step 3: Fetch test details
    const tests = await prisma.test.findMany({
      where: { id: { in: testIds } },
      include: {
        teacher: {
          select: {
            name: true,
            email: true
          }
        },
        questions: {
          select: {
            id: true
          }
        }
      }
    });

    // Step 4: Merge performance data
    const testsWithPerformance = tests.map(test => {
      const perf = performanceByTest[test.id];
      return {
        ...test,
        performance: {
          questionsAttempted: perf.total,
          correctAnswers: perf.correct,
          totalQuestions: test.questions.length,
          score: ((perf.correct / perf.total) * 100).toFixed(2)
        }
      };
    });

    return res.status(200).json({
      message: "Tests fetched successfully",
      tests: testsWithPerformance,
      count: testsWithPerformance.length
    });
  } catch (error) {
    console.error('Error fetching student tests:', error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
