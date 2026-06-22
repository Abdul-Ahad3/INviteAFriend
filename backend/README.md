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

## Visit Request API

All visit request endpoints require the same bearer token.

```http
GET /api/visit-requests
POST /api/visit-requests
GET /api/visit-requests/:id
PUT /api/visit-requests/:id
DELETE /api/visit-requests/:id
Authorization: Bearer <token>
```

Example create/update body:

```json
{
  "visitDate": "2026-06-24",
  "destination": "Islamabad, F-7",
  "lengthOfStay": "3",
  "purpose": "Conference",
  "guestCount": "1",
  "hostPreference": "Quiet home with workspace",
  "message": "I am visiting for meetings and need a calm place to stay."
}
```
