# InviteAFriend Backend

## Setup

Copy `.env.example` to `.env` and set your MongoDB connection string.

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/invite-a-friend
MONGODB_DB_NAME=invite-a-friend
```

Run the backend:

```bash
npm run dev
```

When MongoDB is connected, the backend seeds this default login if it does not already exist:

```txt
email: test@example.com
password: testingtesting2
```

## Profile API

Login first and use the returned token as a bearer token.

```http
GET /api/profile
Authorization: Bearer <token>
```

```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json
```

Example body:

```json
{
  "username": "testuser",
  "name": "Test User",
  "location": "Islamabad",
  "birthday": "1998-01-01",
  "cnic": "XXXXX-XXXXXXX-X",
  "host": {
    "willing": true,
    "houseLocation": "F-7, Islamabad",
    "freeRooms": "1",
    "facilities": "Wi-Fi, workspace",
    "furnished": "furnished",
    "additionalInfo": "Quiet household."
  },
  "visitor": {
    "willing": true,
    "homeLocation": "Lahore",
    "profession": "AI engineer",
    "languages": "English, Urdu",
    "interests": "AI, startups",
    "travelStyle": "Work-focused",
    "bio": "Visiting for meetings and community events."
  }
}
```
