import { redis } from '@/lib/redis';
import { RECTANGLE_BOUNDS, TRIANGLE_BOUNDS, TOTAL_LEAVES } from "@/lib/utils";

export default async function handler(req, res) {
    try {
        const leaves = [];
        let idCounter = 1;

        // Calculate how many leaves for each area
        const triangleArea = (TRIANGLE_BOUNDS.baseWidth * TRIANGLE_BOUNDS.height) / 2;
        const rectangleArea = RECTANGLE_BOUNDS.width * RECTANGLE_BOUNDS.height;
        const totalArea = triangleArea + rectangleArea;

        const triLeavesCount = Math.round((triangleArea / totalArea) * TOTAL_LEAVES);
        const rectLeavesCount = TOTAL_LEAVES - triLeavesCount;

        // --- Rectangle leaves ---
        for (let i = 0; i < rectLeavesCount; i++) {
            const x = Math.random() * RECTANGLE_BOUNDS.width;
            const y = RECTANGLE_BOUNDS.top + Math.random() * RECTANGLE_BOUNDS.height;

            leaves.push({
                id: idCounter++,
                x,
                y,
                color: "#228B22",
                on: true,
            });
        }

        // --- Triangle leaves ---
        for (let i = 0; i < triLeavesCount; i++) {
            // y: distance from triangle tip (top)
            const y = Math.random() * TRIANGLE_BOUNDS.height;

            // Width at this y (linearly increasing from tip to base)
            const halfBaseAtY = (y / TRIANGLE_BOUNDS.height) * (TRIANGLE_BOUNDS.baseWidth / 2);

            // x: random along this line, centered at triangle center
            const x = Math.random() * (2 * halfBaseAtY) - halfBaseAtY + TRIANGLE_BOUNDS.baseWidth / 2;

            leaves.push({
                id: idCounter++,
                x,
                y: y + TRIANGLE_BOUNDS.top, // offset by triangle's top
                color: "#228B22",
                on: true,
            });
        }

        const treeState = { leaves };

        // Save to Redis (one write for all leaves)
        await redis.set('treeState', JSON.stringify(treeState));

        res.status(200).json({ success: true, treeState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}