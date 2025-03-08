// app/api/rsvp/route.js
export async function POST(request) {
    try {
        // Parse the JSON body from the request
        const data = await request.json();

        // Forward the request to your Flask API
        const response = await fetch(`${process.env.FLASK_API_URL}/api/rsvp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Parse the response from the Flask API
        const responseData = await response.json();

        // Return the response with the appropriate status code
        return Response.json(
            responseData,
            { status: response.status }
        );
    } catch (error) {
        console.error('Error forwarding RSVP request:', error);

        // Return an error response
        return Response.json(
            { error: 'Failed to process RSVP submission' },
            { status: 500 }
        );
    }
}