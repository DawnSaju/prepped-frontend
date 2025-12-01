# Setting up Phone Call Support (Twilio)

To enable the "Call Me" feature, you need to connect the local backend to Twilio.

## 1. Get Twilio Credentials (Free Trial)
1.  Sign up at [twilio.com](https://www.twilio.com/).
2.  Get a **Trial Number**.
3.  Copy your **Account SID** and **Auth Token**.

## 2. Expose Localhost to the Internet (ngrok)
Twilio needs a public URL to send the voice webhook to.
1.  Download and install [ngrok](https://ngrok.com/).
2.  Run: `ngrok http 8000`
3.  Copy the Forwarding URL (e.g., `https://abc-123.ngrok-free.app`).

## 3. Configure Environment Variables
Create or update your `.env` file in `backend/`:

```env
GOOGLE_API_KEY=your_gemini_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_twilio_number
BASE_URL=https://abc-123.ngrok-free.app  <-- Your ngrok URL
```

## 4. Restart Backend
```powershell
uvicorn server:app --reload
```

## 5. Test
Use the frontend "Call Me" button or curl:
```bash
curl -X POST http://localhost:8000/initiate-call \
   -H "Content-Type: application/json" \
   -d '{"session_id": "test", "phone_number": "+15551234567"}'
```
