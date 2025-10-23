import { passJson } from '../../../_lib/proxy';

export async function POST(request, context) {
  const { params } = await context;
  return passJson(request, `/api/parties/${params.id}/assign`, 'POST');
}

