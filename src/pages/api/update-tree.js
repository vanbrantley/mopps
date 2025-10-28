// /api/update-tree.js
import { updateTreeForDate, getSeasonPhase } from "@/lib/utils";
import { redis } from "@/lib/redis"; // your existing redis connection

export default async function handler(req, res) {
    try {
        // Optional query param ?date=2025-10-15
        const dateParam = req.query.date;
        const currentDate = dateParam ? new Date(dateParam) : new Date();

        // Fetch current tree state from DB
        const treeStateStr = await redis.get("treeState");
        const tree = treeStateStr ? JSON.parse(treeStateStr) : { leaves: [] };

        // Use updateTreeForDate to modify leaves for this date
        const updatedTree = updateTreeForDate(tree.leaves, currentDate);

        // Save updated tree back to Redis
        await redis.set("treeState", JSON.stringify(updatedTree));

        res.status(200).json({
            tree: updatedTree,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
