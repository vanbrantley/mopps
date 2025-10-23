import { redis } from '@/lib/redis';

export default async function handler(req, res) {
    try {
        // Seed 1000 leaves
        const initialTreeState = {
            leaves: Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                x: Math.floor(Math.random() * 390),   // placeholder x
                y: Math.floor(Math.random() * 844),   // placeholder y
                color: '#228B22',                     // green leaves
                on: true
            }))
        };

        // One write command for all leaves
        await redis.set('treeState', JSON.stringify(initialTreeState));

        res.status(200).json({ success: true, treeState: initialTreeState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
