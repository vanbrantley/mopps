import { useState, useEffect } from "react";

export default function FallVisualizer({ width = 390, height = 650, totalDays = 40 }) {

    const [day, setDay] = useState(0);
    const [leaves, setLeaves] = useState([]);
    const [initialLeaves, setInitialLeaves] = useState([]);

    useEffect(() => {
        fetch("/leaves_1000.json")
            .then((res) => res.json())
            .then((data) => {
                setInitialLeaves(data);
                setLeaves(data);
            });
    }, []);

    const trunkX = width / 2;
    const progress = Math.min(1, day / totalDays); // normalized progress (0 → 1)

    // phase-based ellipse scaling
    const phases = {
        early: { outerScale: 0.8, midScale: 0.95, innerScale: 0.88 },
        mid: { outerScale: 0.8, midScale: 0.9, innerScale: 0.75 },
        late: { outerScale: 0.6, midScale: 0.85, innerScale: 0.7 },
    };

    // pick current phase based on day
    let phase;
    if (day <= 7) phase = phases.early;
    else if (day <= 16) phase = phases.mid;
    else phase = phases.late;

    // const maxOuterRx = width * 0.5;
    // const maxOuterRx = width * 0.8;
    const maxOuterRx = width * phase.outerScale;
    const maxOuterRy = height;

    // Shrinking ellipses — outer shrinks fully from 100% → 0% over totalDays
    const outer = {
        rx: maxOuterRx * (1 - progress),
        ry: maxOuterRy * (1 - progress),
    };
    const mid = {
        // rx: outer.rx * 0.7,
        // ry: outer.ry * 0.7,
        // rx: outer.rx * 0.95,
        // ry: outer.ry * 0.95,
        rx: outer.rx * phase.midScale,
        ry: outer.ry * phase.midScale,
    };
    const inner = {
        // rx: outer.rx * 0.4,
        // ry: outer.ry * 0.4,
        // rx: outer.rx * 0.88,
        // ry: outer.ry * 0.88,
        rx: outer.rx * phase.innerScale,
        ry: outer.ry * phase.innerScale,
    };

    const nextDay = () => setDay(Math.min(totalDays, day + 1));
    const reset = () => {
        setDay(0);
        setLeaves(initialLeaves);
    };

    return (
        <div style={{ position: "relative", width, height }}>
            {/* Leaves behind zones */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-0"
                style={{ width, height, pointerEvents: "none" }}
            >
                {leaves
                    .filter((leaf) => leaf.on)
                    .map((leaf) => (
                        <div
                            key={leaf.id}
                            className="absolute"
                            style={{
                                top: `${leaf.y}px`,
                                left: `${leaf.x}px`,
                                width: "25px",
                                height: "25px",
                                backgroundColor: leaf.color,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
            </div>

            {/* Fall zones overlay */}
            <svg
                width={width}
                height={height}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            >
                <g transform={`translate(0, ${height}) scale(1, -1)`}>
                    <ellipse cx={trunkX} cy={0} rx={outer.rx} ry={outer.ry} fill="rgba(255,165,0,0.3)" />
                    <ellipse cx={trunkX} cy={0} rx={mid.rx} ry={mid.ry} fill="rgba(255,215,0,0.3)" />
                    <ellipse cx={trunkX} cy={0} rx={inner.rx} ry={inner.ry} fill="rgba(154,205,50,0.3)" />
                    <circle cx={trunkX} cy={0} r={3} fill="brown" />
                </g>
            </svg>

            {/* Buttons below visualizer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <div className="flex gap-2">
                    <span className="font-bold text-lg">Day {day}</span>
                    <button
                        onClick={nextDay}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded transition-colors"
                    >
                        Next Day
                    </button>
                </div>

                <button
                    onClick={reset}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-5 rounded transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}