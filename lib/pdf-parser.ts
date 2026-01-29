import { VocabItem } from '@/types';

// Dynamic import strategy to avoid SSR issues with DOMMatrix/Canvas
interface ExtractedRow {
    y: number;
    items: { x: number; text: string }[];
}

export async function parsePdf(file: File): Promise<VocabItem[]> {
    // Dynamically import pdfjs-dist only on the client
    const pdfjsLib = await import('pdfjs-dist');

    // Configure worker - using a specific version close to the installed one is best, 
    // but for client-side without bundling the worker, a CDN is a common workaround.
    // In a real prod app, better to copy file to public/
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let allItems: VocabItem[] = [];

    let globalWordColX = -1;
    let globalSynonymColX = -1;

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Group text items by Y coordinate (roughly) to form rows
        const rows: ExtractedRow[] = [];

        // Type assertion because pdfjs-dist types can be tricky
        const items = textContent.items as unknown as { str: string; transform: number[] }[];

        // Simple clustering by Y position (with tolerance)
        items.forEach((item) => {
            // transform[5] is usually the y position in PDF coordinate space
            // Note: PDF y acts up -> down or down -> up depending on context, usually origin is bottom-left
            const y = Math.round(item.transform[5]);
            const x = Math.round(item.transform[4]);
            const text = item.str.trim();

            if (!text) return;

            let row = rows.find(r => Math.abs(r.y - y) < 5); // 5 unit tolerance
            if (!row) {
                row = { y, items: [] };
                rows.push(row);
            }
            row.items.push({ x, text });
        });

        // Sort rows by Y (Top to Bottom typically means decreasing Y in PDF, but let's check relative)
        // Actually in PDF standard, (0,0) is bottom-left. So higher Y is higher up.
        // We want to read top to bottom, so sort descending Y.
        rows.sort((a, b) => b.y - a.y);

        // Identify Columns based on headers IF not already found
        let headerRowIndex = -1;

        // Only search for headers if we haven't found them yet, OR if this page seems to have a header row re-stated
        // But user said subsequent pages might NOT have headers.
        // So if we already have global coords, we might skip header search unless we want to re-confirm.
        // Let's search if global coords are not set.

        if (globalWordColX === -1 || globalSynonymColX === -1) {
            for (let rIdx = 0; rIdx < rows.length; rIdx++) {
                const row = rows[rIdx];
                // Sort items left to right
                row.items.sort((a, b) => a.x - b.x);

                const rowText = row.items.map(i => i.text.toLowerCase());

                // Debug log (can be removed in prod)
                // console.log('Row:', rowText);

                // Find indices
                const wordIdx = rowText.findIndex(t =>
                    t === 'word' || // Exact match preferred
                    t.includes('word') ||
                    t === 'term' ||
                    t.includes('vocab') ||
                    t === 'kata' ||
                    t.includes('english')
                );

                // Removed 'definition', 'meaning' to avoid picking the Definition column
                const synIdx = rowText.findIndex(t =>
                    t.includes('synonym') ||
                    t.includes('sinonim') ||
                    t === 'persamaan kata'
                );

                if (wordIdx !== -1 && synIdx !== -1) {
                    headerRowIndex = rIdx;
                    globalWordColX = row.items[wordIdx].x;
                    globalSynonymColX = row.items[synIdx].x;
                    break;
                }
            }
        }

        // Extract data
        if (globalWordColX !== -1 && globalSynonymColX !== -1) {
            // If we just found the header on this page, start AFTER the header.
            // If we are on a subsequent page (headerRowIndex == -1), start from the top (0).
            const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;

            // Tolerance
            const tolerance = 80;

            for (let rIdx = startRow; rIdx < rows.length; rIdx++) {
                const row = rows[rIdx];

                const wordItem = row.items.find(i => Math.abs(i.x - globalWordColX) < tolerance);
                const synItem = row.items.find(i => Math.abs(i.x - globalSynonymColX) < tolerance);

                if (wordItem && synItem && wordItem !== synItem) {
                    let cleanWord = wordItem.text.trim();
                    const cleanSynonym = synItem.text.trim();

                    // SKIP headers if they appear again
                    if (cleanWord.toLowerCase().includes('word') || cleanWord.toLowerCase() === 'kata') continue;

                    // CLEAN: Remove index numbers (e.g. "1.", "2")
                    cleanWord = cleanWord.replace(/^[\d.]+\s*/, '');

                    // CLEAN: Remove content in parentheses (e.g. "(n.)", "(adj)")
                    cleanWord = cleanWord.replace(/\s*\(.*?\)/g, '');
                    cleanWord = cleanWord.trim();

                    // If word became empty or too short after cleaning, skip
                    if (cleanWord.length < 2) continue;

                    allItems.push({
                        id: crypto.randomUUID(),
                        word: cleanWord,
                        synonyms: cleanSynonym.split(/[;,]/).map(s => s.trim()).filter(s => s.length > 0),
                        userGuesses: [],
                        status: 'hidden'
                    });
                }
            }
        }
    }

    return allItems;
}
