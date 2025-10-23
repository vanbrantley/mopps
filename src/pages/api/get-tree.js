import { redis } from '../../lib/redis';

export default async function handler(req, res) {
    try {
        const treeState = await redis.get('treeState');

        if (!treeState) {
            return res.status(404).json({ success: false, error: 'treeState not found' });
        }

        res.status(200).json({ success: true, treeState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
