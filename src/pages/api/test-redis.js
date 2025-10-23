import { redis } from '@/lib/redis';

export default async function handler(req, res) {
    try {
        // Set and get a test key
        await redis.set('hello', 'world');
        const value = await redis.get('hello');

        res.status(200).json({ success: true, value });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
