'use client';

import { useState, useEffect } from 'react';

export default function TableOfContents({ content }: { content: string }) {
    const [toc, setToc] = useState<{ id: string; title: string; level: number }[]>([]);

    useEffect(() => {
        const headings = content.split('\n')
            .filter(line => line.startsWith('#'))
            .map(line => {
                const level = line.indexOf(' ');
                const title = line.slice(level + 1);
                const id = title.toLowerCase().replace(/[^\w]+/g, '-');
                return { id, title, level };
            });
        setToc(headings);
    }, [content]);

    return (
        <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
                {toc.map((heading, index) => (
                    <li key={index} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
                        <a href={`#${heading.id}`} className="text-sm hover:underline">
                            {heading.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}