export const BASE = process.env.FLASK_API_URL;

export async function passJson(request, path, method = 'GET') {
  const body = ['POST','PATCH','PUT','DELETE'].includes(method) ? await request.text() : undefined;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' }});
}

export async function passMultipart(request, path) {
  const formData = await request.formData();
  // forward as-is (boundary set automatically)
  const res = await fetch(`${BASE}${path}`, { method: 'POST', body: formData });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' }});
}
