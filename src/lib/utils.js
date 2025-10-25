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
    } else if (monthDay >= SUMMER_START && monthDay < FALL_START) {
        season = "summer";
        phase = "steady";
    } else if (monthDay >= FALL_START && monthDay < WINTER_START) {
        season = "fall";
        phase = monthDay <= FALL_COLOR_PHASE_END ? "color" : "drop";
    } else {
        season = "winter";
        phase = "bare";
    }

    return { season, phase };
}