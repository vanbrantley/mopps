import { redis } from '@/lib/redis';
import { getSeasonPhase } from '@/lib/utils';

export default async function handler(req, res) {
    try {
        // Optional date param: ?date=2025-10-15
        const dateParam = req.query.date;
        const currentDate = dateParam ? new Date(dateParam) : new Date();

        const { season, phase } = getSeasonPhase(currentDate);

        // Fetch current tree state from DB
        const treeStateStr = await redis.get("treeState");
        const tree = JSON.parse(treeStateStr);

        // No changes in summer or winter
        if (season === "summer" || season === "winter") {
            return tree;
        }

        // fall



        // spring



        res.status(200).json({
            date: currentDate.toISOString(),
            monthDay: `${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
            season,
            phase
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
