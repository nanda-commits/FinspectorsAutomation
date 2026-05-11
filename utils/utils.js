

const dotenv = require('dotenv');
const fs = require('fs');

// Load from .env if it exists, otherwise fall back to .env.example
dotenv.config({ path: '.env' });
if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
    dotenv.config({ path: '.env.example' });
}

const username = process.env.ADMIN_USERNAME?.trim();
const password = process.env.PASSWORD?.trim();

if (!username || !password) {
    throw new Error(
        'Missing ADMIN_USERNAME or PASSWORD environment variables. Add them to your .env file and rerun the test.'
    );
}

module.exports = {
    username,
    password,
    readFile: async (fileName) => {
        // TODO read file content and return it
    }
}