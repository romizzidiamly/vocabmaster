export interface IeltsExamples {
    type: 'Simple' | 'Complex' | 'Compound' | 'Compound-Complex';
    text: string;
    translation?: string;
}

export interface GroqResponse {
    meaning: string;
    definition?: string;
    phonetics: { us: string, uk: string };
    examples: IeltsExamples[];
    synonymMeanings?: string[];
}

export async function fetchGroqData(word: string, retries = 3, backoff = 1000): Promise<GroqResponse> {
    try {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word }),
        });

        if (response.status === 429 && retries > 0) {
            console.warn(`Rate limit hit for ${word}. Retrying in ${backoff}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchGroqData(word, retries - 1, backoff * 2);
        }

        if (!response.ok) {
            if (retries > 0) {
                console.warn(`AI Generation failed for ${word} (Status: ${response.status}). Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchGroqData(word, retries - 1, backoff * 2);
            }
            throw new Error('AI Generation Failed');
        }

        const data = await response.json();
        return {
            meaning: data.meaning || 'n/a',
            definition: data.definition,
            phonetics: data.phonetics || { us: 'n/a', uk: 'n/a' },
            examples: data.examples,
            synonymMeanings: data.synonymMeanings
        };
    } catch (error) {
        console.error(`Final failure for ${word}:`, error);
        return {
            meaning: 'Meaning not found.',
            phonetics: { us: '/.../', uk: '/.../' },
            examples: [
                { type: 'Simple', text: `` },
                { type: 'Complex', text: `` },
                { type: 'Compound', text: `` },
                { type: 'Compound-Complex', text: `` },
            ]
        };
    }
}
