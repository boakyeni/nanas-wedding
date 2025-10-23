import { passJson } from '../_lib/proxy';

export async function GET(request) {
  return passJson(request, '/api/guests', 'GET');
}

export async function POST(request) {
  return passJson(request, '/api/guests', 'POST');
}
