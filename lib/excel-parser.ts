import { VocabItem } from '@/types';

// Utility to clean word (remove numbers, parens)
export const cleanWord = (text: string): string => {
    // Remove numbers at start (e.g., "1. Word" or "1 Word")
    let cleaned = text.replace(/^[\d.]+\s*/, '');
    // Remove content in parenthesis (e.g., "Word (n.)" -> "Word")
    cleaned = cleaned.replace(/\s*\(.*?\)/g, '');
    return cleaned.trim();
};

export async function parseExcel(file: File): Promise<VocabItem[]> {
    try {
        // Dynamic import to avoid build/SSR issues with xlsx
        const XLSX = await import('xlsx');

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Header: 1 returns array of arrays [ ["A", "B"], [1, 2] ]
        const jsonData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

        console.log("Raw Excel Data (First 5 rows):", jsonData.slice(0, 5));

        let allItems: VocabItem[] = [];
        let wordColIdx = -1;
        let synColIdx = -1;
        let exampleColIdx = -1;
        let headerRowIdx = -1;

        // 1. Precise Header Search
        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!Array.isArray(row)) continue;

            const rowStr = row.map(cell => String(cell).toLowerCase().trim());

            const wIdx = rowStr.findIndex(t => t === 'word' || t === 'vocabulary' || t === 'kata');
            const sIdx = rowStr.findIndex(t => t === 'synonyms' || t === 'synonym' || t === 'sinonim');

            if (wIdx !== -1 && sIdx !== -1) {
                headerRowIdx = i;
                wordColIdx = wIdx;
                synColIdx = sIdx;
                break;
            }
        }

        // 2. Fallback Guessing
        if (headerRowIdx === -1) {
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!Array.isArray(row)) continue;
                const rowStr = row.map(cell => String(cell).toLowerCase().trim());
                const wIdx = rowStr.findIndex(t => t === 'word');
                if (wIdx !== -1) {
                    headerRowIdx = i;
                    wordColIdx = wIdx;
                    synColIdx = wIdx + 2;
                    break;
                }
            }
        }

        if (headerRowIdx !== -1) {
            for (let i = headerRowIdx + 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!row || row.length <= Math.max(wordColIdx, synColIdx)) continue;

                const rawWord = row[wordColIdx] !== undefined ? String(row[wordColIdx]) : '';
                const rawSyn = row[synColIdx] !== undefined ? String(row[synColIdx]) : '';

                if (rawWord && rawSyn) {
                    const cleanedWord = cleanWord(rawWord);
                    const synonyms = rawSyn.split(/[;,\r\n]+/).map(s => s.trim()).filter(Boolean);

                    if (cleanedWord.length > 1 && synonyms.length > 0) {
                        const lower = cleanedWord.toLowerCase();
                        if (lower === 'word' || lower.includes('topic:')) continue;

                        allItems.push({
                            id: crypto.randomUUID(),
                            word: cleanedWord,
                            synonyms: synonyms,
                            userGuesses: [],
                            status: 'hidden'
                        });
                    }
                }
            }
        }

        console.log(`Parsed ${allItems.length} items from Excel.`);
        return allItems;

    } catch (e) {
        console.error("Excel Parsing Failed:", e);
        throw e;
    }
}
