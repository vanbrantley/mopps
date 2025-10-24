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


// export default async function handler(req, res) {
//     try {
//         const leaves = [];

//         // 1. Calculate areas
//         const rectArea = RECTANGLE_BOUNDS.width * RECTANGLE_BOUNDS.height;
//         const triArea = (TRIANGLE_BOUNDS.baseWidth * TRIANGLE_BOUNDS.height) / 2;
//         const totalArea = rectArea + triArea;

//         // 2. Determine how many leaves go in each area
//         const rectLeavesCount = Math.round((rectArea / totalArea) * TOTAL_LEAVES);
//         const triLeavesCount = TOTAL_LEAVES - rectLeavesCount;

//         let idCounter = 1;

//         // 3. Generate rectangle leaves
//         for (let i = 0; i < rectLeavesCount; i++) {
//             leaves.push({
//                 id: idCounter++,
//                 x: Math.random() * RECTANGLE_BOUNDS.width,
//                 y: RECTANGLE_BOUNDS.top + Math.random() * RECTANGLE_BOUNDS.height,
//                 color: "#228B22",
//                 on: true,
//             });
//         }

//         // 4. Generate triangle leaves
//         // Triangle is isosceles, tip at top, base aligned with rectangle top
//         for (let i = 0; i < triLeavesCount; i++) {
//             const y = TRIANGLE_BOUNDS.top + Math.random() * TRIANGLE_BOUNDS.height;
//             // Width at this y-coordinate (linearly decreasing from base to tip)
//             const halfBaseAtY =
//                 (TRIANGLE_BOUNDS.height - (y - TRIANGLE_BOUNDS.top)) /
//                 TRIANGLE_BOUNDS.height *
//                 (TRIANGLE_BOUNDS.baseWidth / 2);
//             const x = Math.random() * (2 * halfBaseAtY) - halfBaseAtY + TRIANGLE_BOUNDS.baseWidth / 2;
//             leaves.push({
//                 id: idCounter++,
//                 x,
//                 y,
//                 color: "#228B22",
//                 on: true,
//             });
//         }

//         // 5. Save to Redis (single write)
//         const treeState = { leaves };
//         await redis.set("treeState", JSON.stringify(treeState));
//         res.status(200).json({ success: true, treeState });

//         // res.status(200).json({
//         //     success: true,
//         //     leaves,
//         //     totalLeaves: leaves.length
//         // });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// }
