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

        const prompt = `Act as an IELTS Writing Expert, Professional Lexicographer, and Native Indonesian Translator. 
    For the vocabulary word "${word}", generate:
    
    1. A clear, concise English definition (Cambridge Dictionary style).
    2. Its Indonesian meaning/translation - use NATURAL, CONTEXTUALLY APPROPRIATE Indonesian (not literal word-for-word translation).
    3. Exactly 4 example sentences suitable for IELTS Task 2 Writing (with natural Indonesian translations):
       - Simple sentence
       - Complex sentence
       - Compound sentence
       - Compound-Complex sentence
    4. Phonetic symbols (US and UK pronunciation).
    5. Indonesian meanings for common synonyms of this word.
    
    TRANSLATION GUIDELINES:
    - Use formal but natural Indonesian (suitable for academic/IELTS context)
    - Prioritize meaning over literal translation
    - Use common Indonesian expressions when appropriate
    - Ensure translations sound natural to native Indonesian speakers
    - For example sentences, maintain the academic tone of IELTS writing
    
    CRITICAL: You MUST return ONLY a valid JSON object. No intro text, no explanations.
    Response format:
    {
      "definition": "Clear English definition...",
      "meaning": "Natural Indonesian translation (formal, contextual)...",
      "phonetics": {
        "us": "/.../",
        "uk": "/.../\"
      },
      "examples": [
        {"type": "Simple", "text": "IELTS-appropriate sentence...", "translation": "Natural Indonesian translation..."},
        {"type": "Complex", "text": "IELTS-appropriate sentence...", "translation": "Natural Indonesian translation..."},
        {"type": "Compound", "text": "IELTS-appropriate sentence...", "translation": "Natural Indonesian translation..."},
        {"type": "Compound-Complex", "text": "IELTS-appropriate sentence...", "translation": "Natural Indonesian translation..."}
      ],
      "synonymMeanings": ["natural translation1", "natural translation2", ...]
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
                        content: 'You are an expert IELTS tutor and professional Indonesian translator. You provide vocabulary examples in JSON format with natural, contextually appropriate Indonesian translations (not literal word-for-word translations).'
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

            // Relay 429 status for rate limiting
            if (response.status === 429) {
                return NextResponse.json({ error: 'Rate limit exceeded', details: errorText }, { status: 429 });
            }

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
