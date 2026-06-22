import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import {
  connectToDatabase,
  getConnectionState,
  isDatabaseConnected,
} from './config/database.js';
import User from './models/User.js';
import { seedDefaultUser } from './seed/defaultUser.js';
import { verifyPassword } from './utils/password.js';

const PORT = Number(process.env.PORT || 3001);

const sessions = new Map();

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', reject);
  });

const withoutPassword = (user) => ({
  id: user.id || user._id?.toString(),
  name: user.name,
  email: user.email,
});

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    sendJson(res, 200, {
      status: 'ok',
      database: getConnectionState(),
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/login') {
    try {
      if (!isDatabaseConnected()) {
        sendJson(res, 503, { message: 'Database is not connected.' });
        return;
      }

      const { email, password } = await readBody(req);
      const normalizedEmail = String(email || '').trim().toLowerCase();

      const user = await User.findOne({ email: normalizedEmail });

      if (!user || !verifyPassword(password, user.passwordHash)) {
        sendJson(res, 401, { message: 'Invalid email or password.' });
        return;
      }

      const token = randomUUID();
      sessions.set(token, user.id);
      user.lastLoginAt = new Date();
      await user.save();

      sendJson(res, 200, {
        message: 'Logged in successfully.',
        token,
        user: withoutPassword(user),
      });
    } catch (error) {
      sendJson(res, 400, { message: error.message });
    }
    return;
  }

  sendJson(res, 404, { message: 'Route not found.' });
});

const startServer = async () => {
  const connection = await connectToDatabase();

  if (connection) {
    await seedDefaultUser();
  }

  server.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Backend startup failed:', error.message);
  process.exit(1);
});
