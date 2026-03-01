# Email setup (Resend)

## Development (localhost)

Emails are skipped when `NODE_ENV=development`.

To enable sending in development, remove the guard in [`backend/src/emails/emailHandlers.js`](backend/src/emails/emailHandlers.js:1) or set `NODE_ENV` to `production`.

## Production

1. Verify a sending domain in Resend.
2. Set these environment variables:

```
RESEND_API_KEY=your_resend_api_key
RESEND_SENDER_EMAIL=no-reply@your-verified-domain.com
```

Optional test recipient override:

```
RESEND_TEST_EMAIL=your_verified_resend_email
```

`RESEND_TEST_EMAIL` forces all emails to go to that address, useful for staging.
