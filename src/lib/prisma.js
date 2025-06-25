const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance
const prisma = new PrismaClient();

// Export the PrismaClient instance
module.exports = { prisma };
