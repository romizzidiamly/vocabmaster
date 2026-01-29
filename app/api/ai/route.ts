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

        const prompt = `Act as an IELTS Writing Expert, Lexicographer, and Indonesian Translator. 
    For the vocabulary word "${word}", generate:
    1. A clear English definition (Cambridge Dictionary style).
    2. Its Indonesian meaning/translation.
    3. Exactly 4 example sentences (with Indonesian translations) - Simple, Complex, Compound, Compound-Complex.
    4. Phonetic symbols (US and UK).
    5. Indonesian meanings for its synonyms.
    
    IMPORTANT: You MUST return ONLY a JSON object. No intro text.
    Response format:
    {
      "definition": "Clear English definition...",
      "meaning": "Indonesian translation...",
      "phonetics": {
        "us": "/.../",
        "uk": "/.../"
      },
      "examples": [
        {"type": "Simple", "text": "...", "translation": "..."},
        {"type": "Complex", "text": "...", "translation": "..."},
        {"type": "Compound", "text": "...", "translation": "..."},
        {"type": "Compound-Complex", "text": "...", "translation": "..."}
      ],
      "synonymMeanings": ["translation1", "translation2", ...]
    }`;

        console.log('Calling Groq Cloud API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
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
