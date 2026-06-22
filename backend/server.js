import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import {
  connectToDatabase,
  getConnectionState,
  isDatabaseConnected,
} from './config/database.js';
import User from './models/User.js';
import Profile from './models/Profile.js';
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

const getBearerToken = (req) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

const getAuthenticatedUserId = (req) => {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  return sessions.get(token) || null;
};

const requireDatabase = (res) => {
  if (isDatabaseConnected()) {
    return true;
  }

  sendJson(res, 503, { message: 'Database is not connected.' });
  return false;
};

const requireAuth = (req, res) => {
  const userId = getAuthenticatedUserId(req);

  if (!userId) {
    sendJson(res, 401, { message: 'Authentication required.' });
    return null;
  }

  return userId;
};

const toProfileResponse = (profile) => ({
  id: profile.id,
  userId: profile.userId.toString(),
  username: profile.username,
  name: profile.name,
  location: profile.location,
  birthday: profile.birthday,
  cnic: profile.cnic,
  host: profile.host,
  visitor: profile.visitor,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

const normalizeProfileInput = (body) => ({
  username: String(body.username || '').trim(),
  name: String(body.name || '').trim(),
  location: String(body.location || '').trim(),
  birthday: String(body.birthday || ''),
  cnic: String(body.cnic || '').trim(),
  host: {
    willing: Boolean(body.host?.willing),
    houseLocation: String(body.host?.houseLocation || '').trim(),
    freeRooms: String(body.host?.freeRooms || '').trim(),
    facilities: String(body.host?.facilities || '').trim(),
    furnished: String(body.host?.furnished || 'furnished'),
    additionalInfo: String(body.host?.additionalInfo || '').trim(),
  },
  visitor: {
    willing: Boolean(body.visitor?.willing),
    homeLocation: String(body.visitor?.homeLocation || '').trim(),
    profession: String(body.visitor?.profession || '').trim(),
    languages: String(body.visitor?.languages || '').trim(),
    interests: String(body.visitor?.interests || '').trim(),
    travelStyle: String(body.visitor?.travelStyle || '').trim(),
    bio: String(body.visitor?.bio || '').trim(),
  },
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
      if (!requireDatabase(res)) {
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

  if (req.url === '/api/profile') {
    if (!requireDatabase(res)) {
      return;
    }

    const userId = requireAuth(req, res);

    if (!userId) {
      return;
    }

    if (req.method === 'GET') {
      const profile = await Profile.findOne({ userId });

      sendJson(res, 200, {
        profile: profile ? toProfileResponse(profile) : null,
      });
      return;
    }

    if (req.method === 'PUT') {
      try {
        const body = await readBody(req);
        const profileInput = normalizeProfileInput(body);
        const profile = await Profile.findOneAndUpdate(
          { userId },
          { $set: { userId, ...profileInput } },
          {
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
            upsert: true,
          },
        );

        sendJson(res, 200, {
          message: 'Profile saved.',
          profile: toProfileResponse(profile),
        });
      } catch (error) {
        sendJson(res, 400, { message: error.message });
      }
      return;
    }
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
