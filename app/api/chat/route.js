export async function POST(request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return Response.json(
      { error: "N8N_WEBHOOK_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { reply: text };
    }

    if (!response.ok) {
      return Response.json(
        { error: data.error || "n8n webhook request failed" },
        { status: response.status }
      );
    }

    return Response.json({
      reply:
        data.reply || data.output || data.message || text || "No response received"
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to connect to n8n webhook" },
      { status: 500 }
    );
  }
}
