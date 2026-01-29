import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'topics');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // format: owner/repo
const IS_PROD = process.env.NODE_ENV === 'production';

// Ensure data directory exists locally (for dev)
if (!IS_PROD && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function getGitHubFiles() {
    if (!GITHUB_TOKEN || !GITHUB_REPO) return [];

    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/data/topics`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
            next: { revalidate: 0 } // Disable caching for fresh data
        });

        if (!res.ok) return [];
        const files = await res.json();

        const topics = await Promise.all(
            files
                .filter((file: any) => file.name.endsWith('.json'))
                .map(async (file: any) => {
                    const contentRes = await fetch(file.download_url);
                    return contentRes.json();
                })
        );
        return topics;
    } catch (e) {
        console.error("GitHub Fetch Error:", e);
        return [];
    }
}

export async function GET() {
    try {
        if (IS_PROD) {
            const topics = await getGitHubFiles();
            topics.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
            return NextResponse.json(topics);
        }

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

        if (IS_PROD && GITHUB_TOKEN && GITHUB_REPO) {
            const path = `data/topics/${topic.id}.json`;
            const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

            // Check if file exists to get SHA
            const getRes = await fetch(url, {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
            });
            let sha;
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `data: update topic ${topic.name}`,
                    content: Buffer.from(JSON.stringify(topic, null, 2)).toString('base64'),
                    sha
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'GitHub API Error');
            }

            return NextResponse.json({ success: true });
        }

        const filePath = path.join(DATA_DIR, `${topic.id}.json`);
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(topic, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to save topic:', error);
        return NextResponse.json({ error: error.message || 'Failed to save topic' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        if (IS_PROD && GITHUB_TOKEN && GITHUB_REPO) {
            const path = `data/topics/${id}.json`;
            const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

            const getRes = await fetch(url, {
                headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
            });

            if (getRes.ok) {
                const fileData = await getRes.json();
                await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: `data: delete topic ${id}`,
                        sha: fileData.sha
                    })
                });
            }
            return NextResponse.json({ success: true });
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
