const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/prisma');

const protect = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in cookies first
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
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
            
            // Get teacher from the token
            const teacher = await prisma.teacher.findUnique({
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

            if (!teacher) {
                return res.status(401).json({
                    message: 'Not authorized, teacher not found'
                });
            }

            // Add teacher to request object
            req.teacher = teacher;
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            message: 'Server error during authentication',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = { protect };
