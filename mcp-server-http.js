const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const express = require('express');
const {expressjwt} = require('express-jwt');
const { server } = require('./mcp-server.js');
const dotenv = require('dotenv');

dotenv.config();
const JWTSecretKey = process.env.JWT_SECRET_KEY;
const jwtMiddleware = expressjwt({ secret: JWTSecretKey, algorithms: ['HS256'] });

const app = express();

app.use(express.json());

app.post('/mcp', jwtMiddleware, async (req, res) => {
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
})

app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("invalid token...");
    } else {
        console.error('Server error:', error);
        process.exit(1);
    }
});