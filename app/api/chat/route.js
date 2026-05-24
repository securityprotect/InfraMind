function extractReply(data, fallbackText) {
  const items = Array.isArray(data) ? data : [data];

  for (const item of items) {
    if (typeof item === "string" && item.trim()) {
      return item;
    }

    const body = item?.json || item?.body || item;
    const value =
      body?.reply || body?.output || body?.message || body?.text || body?.response;

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
  }

  return fallbackText?.trim() || "No response received";
}

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
      reply: extractReply(data, text)
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to connect to n8n webhook" },
      { status: 500 }
    );
  }
}
