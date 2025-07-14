const { prisma } = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports.TeacherSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({success: false,error:"All fields are required"});
        }

        const existingAccount = await prisma.teacher.findUnique({
            where: {
                email
            }
        });
        if (existingAccount) {
            return res.status(400).json({success: false,error:"Account already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const teacher = await prisma.teacher.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const { password: _, ...teacherWithoutPassword } = teacher;
        const token = generateToken(teacher.id);
        
        // Set HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(201).json({
            message: "Teacher created and logged in successfully",
            teacher: teacherWithoutPassword,
            token: token
        });
    } catch (error) {
        console.error('Error creating teacher:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


module.exports.TeacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({success: false,error:"All fields are required"});
        }

        const teacher = await prisma.teacher.findUnique({
            where: {
                email
            }
        });
        if (!teacher) {
            return res.status(400).json({success: false,error:"Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(400).json({success: false,error:"Invalid password"});
        }

        const { password: _, ...teacherWithoutPassword } = teacher;
        const token = generateToken(teacher.id);
        
        // Set HTTP-only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({
            message: "Teacher logged in successfully",
            teacher: teacherWithoutPassword,
            token: token
        });
    } catch (error) {
        console.error('Error logging in teacher:', error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
    