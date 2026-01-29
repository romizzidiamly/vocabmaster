import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'topics');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            return NextResponse.json([]);
        }

        const files = fs.readdirSync(DATA_DIR);
        const topics = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                try {
                    const filePath = path.join(DATA_DIR, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    return JSON.parse(content);
                } catch (e) {
                    return null;
                }
            })
            .filter(t => t !== null);

        // Sort by createdAt desc
        topics.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        return NextResponse.json(topics);
    } catch (error) {
        console.error('Failed to read topics:', error);
        return NextResponse.json({ error: 'Failed to load topics' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const topic = await request.json();
        if (!topic.id) {
            return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
        }

        const filePath = path.join(DATA_DIR, `${topic.id}.json`);
        // Ensure directory exists again just in case
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify(topic, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save topic:', error);
        return NextResponse.json({ error: 'Failed to save topic' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const filePath = path.join(DATA_DIR, `${id}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete topic:', error);
        return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
    }
}
