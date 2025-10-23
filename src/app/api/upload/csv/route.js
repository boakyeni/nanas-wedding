import { passMultipart } from '../../_lib/proxy';

export async function POST(request) {
  return passMultipart(request, '/api/upload/csv');
}
