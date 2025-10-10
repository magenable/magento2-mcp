const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const username = process.argv[2] ? process.argv[2] : "MCP User";
const token = jwt.sign({ username }, JWTSecretKey, { expiresIn: '1Y' });
console.log(`username: ${username}`)
console.log(`token: ${token}\n`)
console.log('Use this header for auth in your MCP client:\n')
console.log(`Authorization: Bearer ${token}\n`)