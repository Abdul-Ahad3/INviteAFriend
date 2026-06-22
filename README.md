# InviteAFriend

InviteAFriend is a web app for connecting visitors with local hosts. Visitors can plan stays, send visit requests, and track planned visits. Hosts can complete a hosting profile and eventually review visitor requests for their residence.

The project currently has:

- A React/Vite frontend
- A Node.js backend
- MongoDB persistence through Mongoose
- Login with seeded test credentials
- Profile save/load API
- Visit request create/list/update/delete API

## Project Structure

```txt
InviteAFriend/
  backend/    Node.js API server, MongoDB models, auth, API endpoints
  frontend/   React app built with Vite
```

Useful frontend pages:

```txt
/                  Landing page
/logsign           Login/signup UI
/dashboard         Visitor/host dashboard calendar
/me                Profile page
/plan-visit        Visit request form
/visits            Planned visits list/details
```

## Requirements

Install these before running the project:

- Node.js 20 or newer
- npm
- MongoDB, either local, Docker, or MongoDB Atlas

Optional but helpful:

- MongoDB Compass for viewing MongoDB data
- DBeaver PRO/Enterprise if you want to inspect MongoDB in DBeaver

## Environment Variables

Create a backend `.env` file:

```bash
cd backend
cp .env.example .env
```

Default local values:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/invite-a-friend
MONGODB_DB_NAME=invite-a-friend
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

Do not commit `.env`. It is ignored by git.

## MongoDB Setup

The backend needs a running MongoDB server before login, profile, or visit request APIs can work. If MongoDB is already installed and running, you can skip to the dependency install section.

Your local backend `.env` should use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/invite-a-friend
MONGODB_DB_NAME=invite-a-friend
```

### Ubuntu: MongoDB Community Server

Import the MongoDB GPG key:

```bash
curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
--dearmor
```

Add the MongoDB repository.

For Ubuntu 22.04 Jammy:

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

For Ubuntu 24.04 Noble, use `noble` instead of `jammy`:

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

Install MongoDB:

```bash
sudo apt update
sudo apt install -y mongodb-org
```

Start and enable MongoDB:

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify the service:

```bash
sudo systemctl status mongod
```

Test the connection:

```bash
mongosh
```

You should get a Mongo shell prompt:

```javascript
test>
```

### Windows: MongoDB Community Edition

Download the latest MongoDB Community Server MSI installer:

[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

Install it with these options:

- Choose **Complete** installation.
- Keep **Install MongoDB as a Service** enabled.
- Optionally install **MongoDB Compass**.

Verify the service in PowerShell as Administrator:

```powershell
Get-Service MongoDB
```

If the service is not running:

```powershell
Start-Service MongoDB
```

Test the connection:

```powershell
mongosh
```

You should get:

```javascript
test>
```

Optional test database:

```javascript
use testdb

db.users.insertOne({
  name: "Test User",
  email: "test@example.com"
})

db.users.find()
```

### Docker Alternative

If you do not want to install MongoDB directly on your machine, Docker is the quickest option:

```bash
docker run -d \
  --name inviteafriend-mongo \
  -p 27017:27017 \
  -v inviteafriend-mongo-data:/data/db \
  mongo:7
```

If the container already exists:

```bash
docker start inviteafriend-mongo
```

### DBeaver Connection

DBeaver can be used as a MongoDB client if your edition supports MongoDB. It does not run MongoDB by itself; MongoDB must already be installed or running elsewhere.

Connection string:

```txt
mongodb://localhost:27017
```

If authentication is configured:

```txt
mongodb://username:password@localhost:27017/database_name
```

Use **Test Connection** to verify connectivity.

### MongoDB Compass

MongoDB Compass is MongoDB's official GUI client.

Local connection string:

```txt
mongodb://localhost:27017
```

Atlas connection string:

```txt
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

### MongoDB Atlas Cloud Alternative

If a local installation is not required, create a free MongoDB Atlas cluster and use the generated connection string in `backend/.env`, DBeaver, or MongoDB Compass.

## Install Dependencies

From the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run The App Locally

Use two terminals.

Terminal 1, backend:

```bash
cd /media/gogeta/HDD1/InviteAFriend/backend
npm run dev
```

Expected backend URL:

```txt
http://localhost:3001
```

Terminal 2, frontend:

```bash
cd /media/gogeta/HDD1/InviteAFriend/frontend
npm run dev
```

Vite will print the frontend URL, usually:

```txt
http://localhost:5173
```

## Default Test Login

When the backend starts and MongoDB is connected, it seeds this user if it does not already exist:

```txt
email: test@example.com
password: testingtesting2
```

Use those credentials on `/logsign`.

## Health Check

After starting the backend:

```bash
curl http://localhost:3001/api/health
```

Expected shape:

```json
{
  "status": "ok",
  "database": "connected"
}
```

If `database` is `disconnected`, check that MongoDB is running and `backend/.env` has the correct `MONGODB_URI`.

## API Summary

All authenticated endpoints use:

```http
Authorization: Bearer <token>
```

The frontend stores the login token in `localStorage` as `authToken`.

Auth:

```txt
POST /api/login
```

Profile:

```txt
GET /api/profile
PUT /api/profile
```

Visit requests:

```txt
GET    /api/visit-requests
POST   /api/visit-requests
GET    /api/visit-requests/:id
PUT    /api/visit-requests/:id
DELETE /api/visit-requests/:id
```

## Backend Notes

Important files:

```txt
backend/server.js                 API routes and server startup
backend/config/database.js        MongoDB connection
backend/models/User.js            User schema
backend/models/Profile.js         Profile schema
backend/models/VisitRequest.js    Visit request schema
backend/seed/defaultUser.js       Seeds test@example.com
backend/utils/password.js         Password hashing/verification
```

The backend currently uses an in-memory session token map. That is fine for local development, but future production work should replace it with persistent sessions or JWTs.

## Frontend Notes

Important files:

```txt
frontend/src/App.tsx              Routes and shared app state
frontend/src/api.ts               API helper with auth token support
frontend/src/pages/LogSign.tsx    Login/signup screen
frontend/src/pages/Dashboard.tsx  Calendar dashboard
frontend/src/pages/Me.tsx         Profile page
frontend/src/pages/PlanVisit.tsx  Create/edit visit request
frontend/src/pages/Visits.tsx     Planned visit details
frontend/src/App.css              Main shared styling
```

The frontend dev server proxies `/api` to the backend using `frontend/vite.config.ts`.

## Build And Lint

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

Backend syntax check:

```bash
cd backend
node --check server.js
node --check models/User.js
node --check models/Profile.js
node --check models/VisitRequest.js
```

## Common Problems

### `connect ECONNREFUSED 127.0.0.1:27017`

MongoDB is not running at `127.0.0.1:27017`.

Start MongoDB with Docker:

```bash
docker start inviteafriend-mongo
```

Or create it if it does not exist:

```bash
docker run -d \
  --name inviteafriend-mongo \
  -p 27017:27017 \
  -v inviteafriend-mongo-data:/data/db \
  mongo:7
```

### `Database is not connected`

The backend is running, but MongoDB is not connected. Check:

- MongoDB is running
- `backend/.env` exists
- `MONGODB_URI` is correct
- backend was restarted after editing `.env`

### Login works once but not after backend restart

Session tokens are currently stored in memory. Log in again after restarting the backend.

## Non-Technical Overview

InviteAFriend is being built as a hospitality and cultural exchange platform.

The basic flow is:

1. A user logs in.
2. They complete a profile.
3. They can mark themselves willing to be a visitor, a host, or both.
4. Visitors can choose dates on a calendar and create visit requests.
5. Hosts will eventually review and approve requests.

The current version is still a development prototype, but it already has real database-backed login, profiles, and visit requests.
