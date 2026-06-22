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
