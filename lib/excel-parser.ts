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

        console.log("=== EXCEL PARSER DEBUG ===");
        console.log("Total rows:", jsonData.length);
        console.log("First 10 rows:", jsonData.slice(0, 10));

        let allItems: VocabItem[] = [];
        let wordColIdx = -1;
        let synColIdx = -1;
        let defColIdx = -1;
        let headerRowIdx = -1;

        // 1. Precise Header Search
        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!Array.isArray(row)) continue;

            const rowStr = row.map(cell => String(cell).toLowerCase().trim());
            console.log(`Row ${i}:`, rowStr);

            const wIdx = rowStr.findIndex(t => t === 'word' || t === 'vocabulary' || t === 'kata');
            const sIdx = rowStr.findIndex(t => t === 'synonyms' || t === 'synonym' || t === 'sinonim');
            const dIdx = rowStr.findIndex(t => t === 'definition' || t === 'meaning' || t === 'deskripsi' || t === 'arti');

            console.log(`  Word col: ${wIdx}, Synonyms col: ${sIdx}, Definition col: ${dIdx}`);

            if (wIdx !== -1 && sIdx !== -1) {
                headerRowIdx = i;
                wordColIdx = wIdx;
                synColIdx = sIdx;
                defColIdx = dIdx;
                console.log(`✅ HEADER FOUND at row ${i}!`);
                console.log(`  Word column: ${wordColIdx}`);
                console.log(`  Synonyms column: ${synColIdx}`);
                console.log(`  Definition column: ${defColIdx}`);
                break;
            }
        }

        // 2. Fallback Guessing
        if (headerRowIdx === -1) {
            console.log("⚠️ Header not found, trying fallback...");
            for (let i = 0; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!Array.isArray(row)) continue;
                const rowStr = row.map(cell => String(cell).toLowerCase().trim());
                const wIdx = rowStr.findIndex(t => t === 'word');
                if (wIdx !== -1) {
                    headerRowIdx = i;
                    wordColIdx = wIdx;
                    synColIdx = wIdx + 1; // Try next column for synonyms
                    defColIdx = wIdx + 2; // Common Excel structure
                    console.log(`✅ FALLBACK HEADER at row ${i}, Word col: ${wordColIdx}, Syn col: ${synColIdx}`);
                    break;
                }
            }
        }

        if (headerRowIdx === -1) {
            console.error("❌ NO HEADER FOUND! Cannot parse Excel.");
            return [];
        }

        console.log("\n=== PARSING DATA ROWS ===");
        for (let i = headerRowIdx + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length <= Math.max(wordColIdx, synColIdx)) {
                console.log(`Row ${i}: Skipped (too short or empty)`);
                continue;
            }

            const rawWord = row[wordColIdx] !== undefined ? String(row[wordColIdx]) : '';
            const rawSyn = row[synColIdx] !== undefined ? String(row[synColIdx]) : '';
            const rawDef = defColIdx !== -1 && row[defColIdx] !== undefined ? String(row[defColIdx]) : '';

            console.log(`Row ${i}:`);
            console.log(`  Raw Word: "${rawWord}"`);
            console.log(`  Raw Synonyms: "${rawSyn}"`);
            console.log(`  Raw Definition: "${rawDef}"`);

            if (rawWord && rawSyn) {
                const cleanedWord = cleanWord(rawWord);
                const synonyms = rawSyn.split(/[;,\r\n]+/).map(s => s.trim()).filter(Boolean);

                console.log(`  Cleaned Word: "${cleanedWord}"`);
                console.log(`  Parsed Synonyms:`, synonyms);

                if (cleanedWord.length > 1 && synonyms.length > 0) {
                    const lower = cleanedWord.toLowerCase();
                    if (lower === 'word' || lower.includes('topic:')) {
                        console.log(`  ⚠️ Skipped (looks like header or topic)`);
                        continue;
                    }

                    allItems.push({
                        id: crypto.randomUUID(),
                        word: cleanedWord,
                        synonyms: synonyms,
                        definition: rawDef || undefined,
                        userGuesses: [],
                        status: 'hidden'
                    });
                    console.log(`  ✅ Added to items!`);
                } else {
                    console.log(`  ⚠️ Skipped (word too short or no synonyms)`);
                }
            } else {
                console.log(`  ⚠️ Skipped (missing word or synonyms)`);
            }
        }

        console.log(`\n=== PARSING COMPLETE ===`);
        console.log(`Parsed ${allItems.length} items from Excel.`);
        console.log("Items:", allItems);
        return allItems;

    } catch (e) {
        console.error("Excel Parsing Failed:", e);
        throw e;
    }
}
