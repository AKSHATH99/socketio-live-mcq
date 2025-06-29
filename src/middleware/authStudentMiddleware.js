const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');

const protectStudent = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in cookies first
        if (req.cookies && req.cookies.student_jwt) {
            token = req.cookies.student_jwt;
        } 
        // Fallback to Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, no token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get student from the token
            const student = await prisma.student.findUnique({
                where: {
                    id: decoded.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            });

            if (!student) {
                return res.status(401).json({
                    message: 'Not authorized, student not found'
                });
            }

            // Add student to request object
            req.student = student;
            next();
        } catch (error) {
            console.error('Student token verification failed:', error);
            return res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        console.error('Student authentication error:', error);
        return res.status(500).json({
            message: 'Server error during authentication',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = { protectStudent };