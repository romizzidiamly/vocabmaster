import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

/**
 * Vercel KV Implementation
 * - Topic keys: vocab:topic:{id}
 * - Set of topic IDs: vocab:topics:ids
 */

export async function GET() {
    try {
        // Get all topic IDs
        const ids = await kv.smembers('vocab:topics:ids');

        if (!ids || ids.length === 0) {
            return NextResponse.json([]);
        }

        // Fetch all topic objects
        const topicKeys = ids.map(id => `vocab:topic:${id}`);
        const topics = await kv.mget<any[]>(...topicKeys);

        // Filter out any potential nulls and sort
        const validTopics = topics.filter(t => t !== null);
        validTopics.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        return NextResponse.json(validTopics);
    } catch (error) {
        console.error('Failed to read topics from KV:', error);
        return NextResponse.json({ error: 'Failed to load topics' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const topic = await request.json();
        if (!topic.id) {
            return NextResponse.json({ error: 'Topic ID is required' }, { status: 400 });
        }

        // Save topic and add ID to set
        await Promise.all([
            kv.set(`vocab:topic:${topic.id}`, topic),
            kv.sadd('vocab:topics:ids', topic.id)
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save topic to KV:', error);
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

        // Delete topic and remove ID from set
        await Promise.all([
            kv.del(`vocab:topic:${id}`),
            kv.srem('vocab:topics:ids', id)
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete topic from KV:', error);
        return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
    }
}
