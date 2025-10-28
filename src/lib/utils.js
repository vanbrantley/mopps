export const RECTANGLE_BOUNDS = {
    width: 400,
    height: 500,
    top: 150,
};

export const TRIANGLE_BOUNDS = {
    baseWidth: 400,
    height: 150,
    top: 0,
};

export const TOTAL_LEAVES = 1000;

export function getSeasonPhase(date = new Date()) {
    // Use month-day numeric representation to generalize across years
    const monthDay = (date.getMonth() + 1) * 100 + date.getDate();

    let season = "";
    let phase = "";
    let progress = 0;

    // Define main season boundaries
    const SPRING_START = 320;   // Mar 20
    const SUMMER_START = 621;   // Jun 21
    const FALL_START = 922;     // Sep 22
    const WINTER_START = 1221;  // Dec 21

    // Sub-phase end dates (month * 100 + day)
    const SPRING_COLOR_PHASE_END = 415;  // Apr 15
    const FALL_COLOR_PHASE_END = 1015;   // Oct 15

    if (monthDay >= SPRING_START && monthDay < SUMMER_START) {
        season = "spring";
        phase = monthDay <= SPRING_COLOR_PHASE_END ? "color" : "growth";
        progress = (monthDay - SPRING_START) / (SUMMER_START - SPRING_START);
    } else if (monthDay >= SUMMER_START && monthDay < FALL_START) {
        season = "summer";
        phase = "steady";
        progress = (monthDay - SUMMER_START) / (FALL_START - SUMMER_START);
    } else if (monthDay >= FALL_START && monthDay < WINTER_START) {
        season = "fall";
        phase = monthDay <= FALL_COLOR_PHASE_END ? "color" : "drop";
        progress = (monthDay - FALL_START) / (WINTER_START - FALL_START);
    } else {
        season = "winter";
        phase = "bare";
        // Progress wraps around year-end
        const WINTER_END = SPRING_START + 10000; // Jan+ Dec wrap
        progress = (monthDay >= WINTER_START ? monthDay - WINTER_START : monthDay + 10000 - WINTER_START) / (WINTER_END - WINTER_START);
    }

    return { season, phase, progress };
}

export function updateTreeForDate(leaves, date) {
    const currentDate = date ? new Date(date) : new Date();
    const { season, phase, progress } = getSeasonPhase(currentDate);

    // Clone leaves to avoid mutating input
    const updatedLeaves = [...leaves];

    const trunkX = 390 / 2; // adjust if needed for tree width

    if (season === "fall") {
        // phase-based scaling for zones (early/mid/late)
        const phasesConfig = {
            early: { outerScale: 0.8, midScale: 0.95, innerScale: 0.88 },
            mid: { outerScale: 0.8, midScale: 0.9, innerScale: 0.75 },
            late: { outerScale: 0.6, midScale: 0.85, innerScale: 0.7 },
        };

        // Pick sub-phase based on day of phase (simplified example)
        const day = Math.floor(progress * 24); // total days of fall phase
        let subPhase;
        if (day <= 7) subPhase = phasesConfig.early;
        else if (day <= 16) subPhase = phasesConfig.mid;
        else subPhase = phasesConfig.late;

        // base max radii
        const maxOuterRx = 390 * subPhase.outerScale;
        const maxOuterRy = 650;
        const progressAdjusted = Math.min(1, progress);

        const outerRx = maxOuterRx * (1 - progressAdjusted);
        const outerRy = maxOuterRy * (1 - progressAdjusted);
        const midRx = outerRx * subPhase.midScale;
        const midRy = outerRy * subPhase.midScale;
        const innerRx = outerRx * subPhase.innerScale;
        const innerRy = outerRy * subPhase.innerScale;

        if (phase === "color") {
            updatedLeaves.forEach((leaf) => {
                const dx = leaf.x - trunkX;
                const dy = leaf.y;

                const distOuter = (dx * dx) / (outerRx * outerRx) + (dy * dy) / (outerRy * outerRy);
                const distMid = (dx * dx) / (midRx * midRx) + (dy * dy) / (midRy * midRy);
                const distInner = (dx * dx) / (innerRx * innerRx) + (dy * dy) / (innerRy * innerRy);

                if (distOuter <= 1 && distMid >= 1) {
                    leaf.color = "rgba(255,165,0,0.3)"; // orange
                    leaf.on = true;
                } else if (distMid < 1 && distInner >= 1) {
                    leaf.color = "rgba(255,215,0,0.3)"; // yellow
                    leaf.on = true;
                } else if (distInner < 1) {
                    leaf.color = "rgba(154,205,50,0.3)"; // green
                    leaf.on = true;
                }
            });
        }

        if (phase === "drop") {
            const droppableLeaves = updatedLeaves.filter((leaf) => {
                if (!leaf.on) return false;
                const dx = leaf.x - trunkX;
                const dy = leaf.y;
                const distOuter = (dx * dx) / (outerRx * outerRx) + (dy * dy) / (outerRy * outerRy);
                const distInner = (dx * dx) / (innerRx * innerRx) + (dy * dy) / (innerRy * innerRy);
                return distOuter <= 1 && distInner >= 1;
            });

            const fractionToDrop = 0.1;
            const numToDrop = Math.ceil(droppableLeaves.length * fractionToDrop);

            for (let i = droppableLeaves.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [droppableLeaves[i], droppableLeaves[j]] = [droppableLeaves[j], droppableLeaves[i]];
            }

            for (let i = 0; i < numToDrop && i < droppableLeaves.length; i++) {
                droppableLeaves[i].on = false;
            }
        }
    }

    if (season === "spring") {
        const currentlyOn = updatedLeaves.filter((leaf) => leaf.on).length;
        const totalLeaves = updatedLeaves.length;
        const targetOn = Math.floor(totalLeaves * progress);
        const newLeavesToTurnOn = targetOn - currentlyOn;

        if (newLeavesToTurnOn > 0) {
            const offLeaves = updatedLeaves.filter((leaf) => !leaf.on);

            for (let i = offLeaves.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [offLeaves[i], offLeaves[j]] = [offLeaves[j], offLeaves[i]];
            }

            for (let i = 0; i < newLeavesToTurnOn && i < offLeaves.length; i++) {
                offLeaves[i].on = true;
            }
        }
    }

    return { leaves: updatedLeaves };
}

// export function updateTreeForDate(tree, date) {
//     const currentDate = date ? new Date(date) : new Date();
//     const { season, phase, progress } = getSeasonPhase(currentDate);

//     // Clone tree to avoid mutation
//     const updatedTree = { ...tree, leaves: [...tree.leaves] };

//     // --- WINTER & SUMMER ---
//     if (season === "summer" || season === "winter") {
//         return updatedTree;
//     }

//     // --- FALL ---
//     if (season === "fall") {
//         const trunkX = 390 / 2;

//         const phasesConfig = {
//             early: { outerScale: 0.8, midScale: 0.95, innerScale: 0.88 },
//             mid: { outerScale: 0.8, midScale: 0.9, innerScale: 0.75 },
//             late: { outerScale: 0.6, midScale: 0.85, innerScale: 0.7 },
//         };

//         // Sub-phase by progress
//         let subPhase;
//         if (progress <= 0.25) subPhase = phasesConfig.early;
//         else if (progress <= 0.6) subPhase = phasesConfig.mid;
//         else subPhase = phasesConfig.late;

//         const maxOuterRx = 390 * subPhase.outerScale;
//         const maxOuterRy = 650;
//         const progressAdjusted = Math.min(1, progress);

//         const outerRx = maxOuterRx * (1 - progressAdjusted);
//         const outerRy = maxOuterRy * (1 - progressAdjusted);
//         const midRx = outerRx * subPhase.midScale;
//         const midRy = outerRy * subPhase.midScale;
//         const innerRx = outerRx * subPhase.innerScale;
//         const innerRy = outerRy * subPhase.innerScale;

//         if (phase === "color") {
//             updatedTree.leaves.forEach((leaf) => {
//                 const dx = leaf.x - trunkX;
//                 const dy = leaf.y;

//                 const distOuter = (dx * dx) / (outerRx * outerRx) + (dy * dy) / (outerRy * outerRy);
//                 const distMid = (dx * dx) / (midRx * midRx) + (dy * dy) / (midRy * midRy);
//                 const distInner = (dx * dx) / (innerRx * innerRx) + (dy * dy) / (innerRy * innerRy);

//                 if (distOuter <= 1 && distMid >= 1) leaf.color = "rgba(255,165,0,0.3)";
//                 else if (distMid < 1 && distInner >= 1) leaf.color = "rgba(255,215,0,0.3)";
//                 else if (distInner < 1) leaf.color = "rgba(154,205,50,0.3)";
//             });
//         }

//         if (phase === "drop") {
//             const droppableLeaves = updatedTree.leaves.filter((leaf) => {
//                 if (!leaf.on) return false;
//                 const dx = leaf.x - trunkX;
//                 const dy = leaf.y;
//                 const distOuter = (dx * dx) / (outerRx * outerRx) + (dy * dy) / (outerRy * outerRy);
//                 const distInner = (dx * dx) / (innerRx * innerRx) + (dy * dy) / (innerRy * innerRy);
//                 return distOuter <= 1 && distInner >= 1;
//             });

//             const fractionToDrop = 0.1;
//             const numToDrop = Math.ceil(droppableLeaves.length * fractionToDrop);

//             for (let i = droppableLeaves.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [droppableLeaves[i], droppableLeaves[j]] = [droppableLeaves[j], droppableLeaves[i]];
//             }

//             for (let i = 0; i < numToDrop && i < droppableLeaves.length; i++) {
//                 droppableLeaves[i].on = false;
//             }
//         }

//         return updatedTree;
//     }

//     // --- SPRING ---
//     if (season === "spring") {
//         const updatedLeaves = [...updatedTree.leaves];
//         const currentlyOn = updatedLeaves.filter((leaf) => leaf.on).length;
//         const totalLeaves = updatedLeaves.length;
//         const targetOn = Math.floor(totalLeaves * progress);
//         const newLeavesToTurnOn = targetOn - currentlyOn;

//         if (newLeavesToTurnOn > 0) {
//             const offLeaves = updatedLeaves.filter((leaf) => !leaf.on);

//             for (let i = offLeaves.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [offLeaves[i], offLeaves[j]] = [offLeaves[j], offLeaves[i]];
//             }

//             for (let i = 0; i < newLeavesToTurnOn && i < offLeaves.length; i++) {
//                 offLeaves[i].on = true;
//             }
//         }

//         updatedTree.leaves = updatedLeaves;
//     }

//     return updatedTree;
// }
