import { passJson } from '../../_lib/proxy';

export async function POST(request) {
  return passJson(request, '/api/guests/unassign', 'POST');
}
