const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

export async function proxyToBackend(request) {
  const incomingUrl = new URL(request.url);
  const targetUrl = `${BACKEND_API_URL}${incomingUrl.pathname}${incomingUrl.search}`;
  const headers = new Headers(request.headers);

  headers.delete("host");
  headers.delete("connection");

  let body;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body && body.byteLength ? body : undefined,
      redirect: "manual",
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return Response.json(
      {
        message: "Backend API unavailable",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
