import { passJson } from '../../_lib/proxy';

export async function PATCH(request, context) {
  const { params } = await context;
  return passJson(request, `/api/guests/${params.id}`, 'PATCH');
}

export async function DELETE(request, context) {
  const { params } = await context;
  return passJson(request, `/api/guests/${params.id}`, 'DELETE');
}
