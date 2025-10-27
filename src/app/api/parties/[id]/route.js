import { passJson } from '../../_lib/proxy';

export async function PATCH(request, {params}) {
  const { id } = await params;
  return passJson(request, `/api/parties/${id}`, 'PATCH');
}

export async function DELETE(request, {params}) {
  const { id } = await params;
  return passJson(request, `/api/parties/${id}`, 'DELETE');
}
