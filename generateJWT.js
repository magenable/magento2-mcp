const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const token = jwt.sign({ username: "MCP User" }, JWTSecretKey, { expiresIn: '4h' });
console.log('Use this header for auth in your MCP client:\n')
console.log(`Authorization: Bearer ${token}\n`)