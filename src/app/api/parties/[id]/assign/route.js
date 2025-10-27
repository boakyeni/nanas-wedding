import { passJson } from '../../../_lib/proxy';

export async function POST(request, {params}) {
  const { id } = await params;
  return passJson(request, `/api/parties/${id}/assign`, 'POST');
}

