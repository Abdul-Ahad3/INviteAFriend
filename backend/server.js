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
import VisitRequest from './models/VisitRequest.js';
import { seedDefaultUser } from './seed/defaultUser.js';
import { verifyPassword } from './utils/password.js';

const PORT = Number(process.env.PORT || 3001);

const sessions = new Map();

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
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

const toVisitRequestResponse = (visitRequest) => ({
  id: visitRequest.id,
  visitorUserId: visitRequest.visitorUserId.toString(),
  hostUserId: visitRequest.hostUserId?.toString() || null,
  residenceId: visitRequest.residenceId?.toString() || null,
  visitDate: visitRequest.visitDate,
  destination: visitRequest.destination,
  lengthOfStay: visitRequest.lengthOfStay,
  purpose: visitRequest.purpose,
  guestCount: visitRequest.guestCount,
  hostPreference: visitRequest.hostPreference,
  message: visitRequest.message,
  status: visitRequest.status,
  createdAt: visitRequest.createdAt,
  updatedAt: visitRequest.updatedAt,
});

const normalizeVisitRequestInput = (body) => ({
  visitDate: String(body.visitDate || ''),
  destination: String(body.destination || '').trim(),
  lengthOfStay: String(body.lengthOfStay || '').trim(),
  purpose: String(body.purpose || '').trim(),
  guestCount: String(body.guestCount || '1').trim(),
  hostPreference: String(body.hostPreference || '').trim(),
  message: String(body.message || '').trim(),
  status: String(body.status || 'pending'),
});

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/health') {
    sendJson(res, 200, {
      status: 'ok',
      database: getConnectionState(),
    });
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/login') {
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

  if (requestUrl.pathname === '/api/profile') {
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

  if (requestUrl.pathname === '/api/visit-requests') {
    if (!requireDatabase(res)) {
      return;
    }

    const userId = requireAuth(req, res);

    if (!userId) {
      return;
    }

    if (req.method === 'GET') {
      const visitRequests = await VisitRequest.find({
        visitorUserId: userId,
      }).sort({ visitDate: 1, createdAt: -1 });

      sendJson(res, 200, {
        visitRequests: visitRequests.map(toVisitRequestResponse),
      });
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await readBody(req);
        const visitRequestInput = normalizeVisitRequestInput(body);
        const visitRequest = await VisitRequest.create({
          ...visitRequestInput,
          visitorUserId: userId,
        });

        sendJson(res, 201, {
          message: 'Visit request created.',
          visitRequest: toVisitRequestResponse(visitRequest),
        });
      } catch (error) {
        sendJson(res, 400, { message: error.message });
      }
      return;
    }
  }

  if (requestUrl.pathname.startsWith('/api/visit-requests/')) {
    if (!requireDatabase(res)) {
      return;
    }

    const userId = requireAuth(req, res);

    if (!userId) {
      return;
    }

    const visitRequestId = requestUrl.pathname.split('/').at(-1);

    if (!/^[a-f\d]{24}$/i.test(visitRequestId)) {
      sendJson(res, 404, { message: 'Visit request not found.' });
      return;
    }

    const visitRequest = await VisitRequest.findOne({
      _id: visitRequestId,
      visitorUserId: userId,
    });

    if (!visitRequest) {
      sendJson(res, 404, { message: 'Visit request not found.' });
      return;
    }

    if (req.method === 'GET') {
      sendJson(res, 200, {
        visitRequest: toVisitRequestResponse(visitRequest),
      });
      return;
    }

    if (req.method === 'PUT') {
      try {
        const body = await readBody(req);
        const visitRequestInput = normalizeVisitRequestInput(body);
        Object.assign(visitRequest, visitRequestInput);
        await visitRequest.save();

        sendJson(res, 200, {
          message: 'Visit request updated.',
          visitRequest: toVisitRequestResponse(visitRequest),
        });
      } catch (error) {
        sendJson(res, 400, { message: error.message });
      }
      return;
    }

    if (req.method === 'DELETE') {
      await visitRequest.deleteOne();
      sendJson(res, 200, { message: 'Visit request deleted.' });
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
