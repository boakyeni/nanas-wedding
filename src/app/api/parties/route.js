import { passJson } from '../_lib/proxy';

export async function GET(request) {
  return passJson(request, '/api/parties', 'GET');
}

export async function POST(request) {
  return passJson(request, '/api/parties', 'POST');
}
