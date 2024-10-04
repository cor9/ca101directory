'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiEffect() {
    useEffect(() => {
        confetti({
            particleCount: 300,
            spread: 90,
            origin: { y: 0.6 }
        });
    }, []);

    return null;
}