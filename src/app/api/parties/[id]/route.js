import { passJson } from '../../_lib/proxy';

export async function PATCH(request, context) {
  const { params } = await context;
  return passJson(request, `/api/parties/${params.id}`, 'PATCH');
}

export async function DELETE(request, context) {
  const { params } = await context;
  return passJson(request, `/api/parties/${params.id}`, 'DELETE');
}
