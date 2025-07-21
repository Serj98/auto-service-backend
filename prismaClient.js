const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
// prismaClient.js
// This file initializes the Prisma Client to interact with the database.
// It exports the Prisma Client instance for use in other parts of the application.
// Make sure to handle the connection properly in your application to avoid memory leaks.
// You can use this instance to perform database operations like queries, mutations, etc.