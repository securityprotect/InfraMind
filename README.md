# AI Support Assistant

Next.js chat app that sends user messages to an n8n webhook through a server-side API route.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/your-webhook-path
```

Use the production webhook URL from n8n, not the temporary test URL, after the workflow is active.

3. Run locally:

```bash
npm run dev
```

## Vercel setup

Add this environment variable in Vercel project settings:

```bash
N8N_WEBHOOK_URL=https://your-n8n-domain.com/webhook/your-webhook-path
```

Then redeploy the project.

## Expected n8n response

The app reads the bot answer from one of these fields:

```json
{
  "reply": "Your answer"
}
```

`output` or `message` also works. Plain text responses are supported too.
