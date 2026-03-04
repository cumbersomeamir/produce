import { proxyToBackend } from "@/lib/backend-proxy";

export async function GET(request) {
  return proxyToBackend(request);
}

export async function POST(request) {
  return proxyToBackend(request);
}

export async function PUT(request) {
  return proxyToBackend(request);
}

export async function PATCH(request) {
  return proxyToBackend(request);
}

export async function DELETE(request) {
  return proxyToBackend(request);
}

export async function OPTIONS(request) {
  return proxyToBackend(request);
}

export async function HEAD(request) {
  return proxyToBackend(request);
}
