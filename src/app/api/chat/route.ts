import { auth } from "@clerk/nextjs/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export async function POST(req: Request) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = await getToken();
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const response = await fetch(`${baseUrl}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages: body.messages,
      config: {
        max_iterations: 10,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
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
}