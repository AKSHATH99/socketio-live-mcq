
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
            return res.status(400).json({message:"All fields are required"});
        }

        const existingAccount = await prisma.student.findUnique({
            where: {
                email
            }
        });
        if (existingAccount) {
            return res.status(400).json({message:"Account already exists"});
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
            return res.status(400).json({message:"All fields are required"});
        }

        const student = await prisma.student.findUnique({
            where: {
                email
            }
        });
        if (!student) {
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(400).json({message:"Invalid email or password"});
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
            return res.status(400).json({message:"All fields are required"});
        }

        const student = await prisma.student.findUnique({
            where: {
                id
            }
        });
        if (!student) {
            return res.status(400).json({message:"Invalid id"});
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