export interface IeltsExamples {
    type: 'Simple' | 'Complex' | 'Compound' | 'Compound-Complex';
    text: string;
}

export interface GroqResponse {
    meaning: string;
    phonetics: { us: string, uk: string };
    examples: IeltsExamples[];
}

export async function fetchGroqData(word: string): Promise<GroqResponse> {
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word }),
        });

        if (!response.ok) {
            throw new Error('AI Generation Failed');
        }

        const data = await response.json();
        return {
            meaning: data.meaning || 'n/a',
            phonetics: data.phonetics || { us: 'n/a', uk: 'n/a' },
            examples: data.examples
        };
    } catch (error) {
        console.error('Failed to fetch Groq data:', error);
        return {
            meaning: 'Meaning not found.',
            phonetics: { us: '/.../', uk: '/.../' },
            examples: [
                { type: 'Simple', text: `Usage of ${word} is important.` },
                { type: 'Complex', text: `Because ${word} matters, we should study it.` },
                { type: 'Compound', text: `The word is ${word}, and it is useful.` },
                { type: 'Compound-Complex', text: `If we use ${word} correctly, we succeed, so let's try.` },
            ]
        };
    }
}
