export const dynamic = 'force-dynamic'; // disables edge runtime for this route

export async function GET() {
  try {
    const flaskUrl = `${process.env.FLASK_API_URL}/api/rsvps/download`;

    const flaskResponse = await fetch(flaskUrl);

    if (!flaskResponse.ok) {
      return new Response('Failed to fetch CSV from Flask', { status: 500 });
    }

    const csv = await flaskResponse.text();

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="rsvps.csv"',
      },
    });
  } catch (err) {
    console.error('Error in /api/rsvps/download:', err);
    return new Response('Internal server error', { status: 500 });
  }
}
