import { auth } from "@clerk/nextjs/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId, getToken } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = await getToken();
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return new Response("Missing sessionId", { status: 400 });
    }

    const body = await req.json();

    // useChat sends the full message history, but the backend only needs new messages.
    // It fetches the full history from the DB itself. Only forward the last message.
    const lastMessage = body.messages?.[body.messages.length - 1];
    const newMessages = lastMessage ? [lastMessage] : [];

    const response = await fetch(`${baseUrl}/sessions/${sessionId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: newMessages,
        config: {
          max_iterations: 10,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[stream proxy] Backend ${response.status}: ${errorBody}`);
      return new Response(`Backend error: ${response.statusText}`, {
        status: response.status,
      });
    }

    // Return the SSE stream directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[stream proxy] Unhandled error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
