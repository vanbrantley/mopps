import { useState, useEffect } from "react";
import { getSeasonPhase, updateTreeForDate } from "@/lib/utils";

export default function YearVisualizer({ width = 390, height = 650 }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [initialLeaves, setInitialLeaves] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [season, setSeason] = useState("");
    const [phase, setPhase] = useState("");
    const [progress, setProgress] = useState(0);

    // Load initial leaves
    useEffect(() => {
        fetch("/leaves_1000.json")
            .then((res) => res.json())
            .then((data) => {
                setInitialLeaves(data);

                // Update tree for today
                const updatedTree = updateTreeForDate(data, new Date());
                setLeaves(updatedTree.leaves);

                const { season, phase, progress } = getSeasonPhase(new Date());
                setSeason(season);
                setPhase(phase);
                setProgress(progress);
            });
    }, []);

    const updateLeavesForDate = (newDate) => {
        const updatedTree = updateTreeForDate(initialLeaves, newDate);
        setLeaves(updatedTree.leaves);

        const { season, phase, progress } = getSeasonPhase(newDate);
        setSeason(season);
        setPhase(phase);
        setProgress(progress);

        setCurrentDate(newDate);
    };

    const nextDay = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        updateLeavesForDate(nextDate);
    };

    const skip10Days = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 10);
        updateLeavesForDate(nextDate);
    };

    const reset = () => {
        updateLeavesForDate(new Date());
    };

    return (
        <div style={{ position: "relative", width, height }}>
            {/* Info overlay */}
            <div
                className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md p-2 rounded-md text-center shadow-md"
                style={{ minWidth: "200px" }}
            >
                <div className="font-bold">Date: {currentDate.toDateString()}</div>
                <div>Season: <span className="text-indigo-600 font-semibold">{season}</span></div>
                <div>Phase: <span className="text-green-600 font-semibold">{phase}</span></div>
                <div>Progress: <span className="text-orange-600 font-semibold">{(progress * 100).toFixed(1)}%</span></div>
            </div>

            {/* Leaves */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0" style={{ width, height, pointerEvents: "none" }}>
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

            {/* Controls */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <div className="flex gap-2">
                    <button onClick={nextDay} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded transition-colors">
                        Next Day
                    </button>
                    <button onClick={skip10Days} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded transition-colors">
                        +10 Days
                    </button>
                </div>
                <button onClick={reset} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-5 rounded transition-colors">
                    Reset
                </button>
            </div>
        </div>
    );
}


// import { useState, useEffect } from "react";
// import { updateTreeForDate, getSeasonPhase } from "@/lib/utils";

// export default function YearVisualizer({ width = 390, height = 650, totalDays = 365 }) {
//     const [day, setDay] = useState(0);
//     const [leaves, setLeaves] = useState([]);
//     const [initialLeaves, setInitialLeaves] = useState([]);
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [season, setSeason] = useState("");
//     const [phase, setPhase] = useState("");
//     const [progress, setProgress] = useState(0);

//     // Fetch initial leaves once
//     useEffect(() => {
//         fetch("/leaves_1000.json")
//             .then((res) => res.json())
//             .then((data) => {
//                 setInitialLeaves(data);

//                 // Immediately update tree for today
//                 const today = new Date();
//                 const updatedTree = updateTreeForDate(data, today);
//                 setLeaves(updatedTree.leaves);

//                 const { season, phase, progress } = getSeasonPhase(today);
//                 setSeason(season);
//                 setPhase(phase);
//                 setProgress(progress);

//                 // Set day offset from Jan 1
//                 const startOfYear = new Date(today.getFullYear(), 0, 1);
//                 setDay(Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)));
//                 setCurrentDate(today);
//             });
//     }, []);

//     const updateLeavesForDay = (newDay) => {
//         const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
//         const newDate = new Date(startOfYear.getTime() + newDay * 24 * 60 * 60 * 1000);

//         const updatedTree = updateTreeForDate(initialLeaves, newDate);
//         setLeaves(updatedTree.leaves);
//         setDay(newDay);
//         setCurrentDate(newDate);

//         const { season, phase, progress } = getSeasonPhase(newDate);
//         setSeason(season);
//         setPhase(phase);
//         setProgress(progress);
//     };

//     const nextDay = () => updateLeavesForDay(Math.min(totalDays, day + 1));
//     const skip10Days = () => updateLeavesForDay(Math.min(totalDays, day + 10));
//     const reset = () => {
//         const today = new Date();
//         updateLeavesForDay(today);
//     };

//     const trunkX = width / 2;

//     return (
//         <div style={{ position: "relative", width, height }}>
//             {/* Leaves */}
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0" style={{ width, height, pointerEvents: "none" }}>
//                 {leaves
//                     .filter((leaf) => leaf.on)
//                     .map((leaf) => (
//                         <div
//                             key={leaf.id}
//                             className="absolute"
//                             style={{
//                                 top: `${leaf.y}px`,
//                                 left: `${leaf.x}px`,
//                                 width: "25px",
//                                 height: "25px",
//                                 backgroundColor: leaf.color,
//                                 transform: "translate(-50%, -50%)",
//                             }}
//                         />
//                     ))}
//             </div>

//             {/* Info overlay */}
// <div
//     className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md p-2 rounded-md text-center shadow-md"
//     style={{ minWidth: "200px" }}
// >
//     <div className="font-bold">Date: {currentDate.toDateString()}</div>
//     <div>Season: <span className="text-indigo-600 font-semibold">{season}</span></div>
//     <div>Phase: <span className="text-green-600 font-semibold">{phase}</span></div>
//     <div>Progress: <span className="text-orange-600 font-semibold">{(progress * 100).toFixed(1)}%</span></div>
// </div>


//             {/* Controls */}
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
//                 <div className="flex gap-2">
//                     <button onClick={nextDay} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded">
//                         Next Day
//                     </button>
//                     <button onClick={skip10Days} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-3 rounded">
//                         +10 Days
//                     </button>
//                 </div>
//                 <button onClick={reset} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-5 rounded">
//                     Reset
//                 </button>
//             </div>
//         </div>
//     );
// }
