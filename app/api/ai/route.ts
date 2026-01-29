import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { word } = await request.json();

        // GROQ_API_KEY from .env.local
        const apiKey = process.env.GROQ_API_KEY;

        console.log('--- Groq AI Generation Request ---');
        console.log(`Word: ${word}`);
        console.log(`API Key Found: ${!!apiKey}`);

        if (!apiKey) {
            console.error('ERROR: GROQ_API_KEY is not defined in process.env');
            return NextResponse.json({
                error: 'Groq API key not configured. Please restart your dev server (npm run dev) to pick up changes from .env.local'
            }, { status: 500 });
        }

        const prompt = `Act as an IELTS Writing Expert and Indonesian Translator. For the vocabulary word "${word}", generate its Indonesian meaning/translation, exactly 4 example sentences (with their Indonesian translations), and its phonetic symbols in JSON format. 
    The sentences must be high-quality and suitable for IELTS Writing Task 2.
    Provide one of each type: "Simple", "Complex", "Compound", "Compound-Complex".
    Also provide the phonetic symbols for American (US) and British (UK) English.
    
    IMPORTANT: You MUST return ONLY a JSON object. No intro text, no conversational filler.
    Response format:
    {
      "meaning": "Indonesian translation of the main word",
      "phonetics": {
        "us": "/.../",
        "uk": "/.../"
      },
      "examples": [
        {"type": "Simple", "text": "English sentence...", "translation": "Indonesian translation..."},
        {"type": "Complex", "text": "English sentence...", "translation": "Indonesian translation..."},
        {"type": "Compound", "text": "English sentence...", "translation": "Indonesian translation..."},
        {"type": "Compound-Complex", "text": "English sentence...", "translation": "Indonesian translation..."}
      ]
    }`;

        console.log('Calling Groq Cloud API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an IELTS tutor that provides vocabulary examples in JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error Status:', response.status);
            console.error('Groq API Error Body:', errorText);
            return NextResponse.json({ error: 'AI Generation Failed', details: errorText }, { status: 502 });
        }

        const data = await response.json();
        console.log('Groq API Success');

        try {
            const content = data.choices[0].message.content;
            const result = JSON.parse(content);
            return NextResponse.json(result);
        } catch (parseError) {
            console.error('Failed to parse Groq response content:', data.choices[0].message.content);
            return NextResponse.json({ error: 'Invalid AI Response Format' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('SERVER ERROR in /api/ai:', error.message);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
