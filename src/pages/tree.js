import Image from "next/image";
import { useEffect, useState } from "react";
import TreeIcon from "@/components/TreeIcon";
import { RECTANGLE_BOUNDS, TRIANGLE_BOUNDS } from "@/lib/utils";

export default function Tree() {

    const [leaves, setLeaves] = useState([]);

    // // using json tree data
    // useEffect(() => {
    //     fetch("/leaves_1000.json")
    //         .then((res) => res.json())
    //         .then((data) => setLeaves(data));
    // }, []);

    // using the Redis db
    useEffect(() => {
        fetch("/api/get-tree")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.treeState?.leaves) {
                    setLeaves(data.treeState.leaves);
                }
            })
            .catch((err) => console.error("Error fetching treeState:", err));
    }, []);

    return (

        <div className="relative flex justify-center items-center min-h-screen overflow-auto">

            {/* Tree image */}
            <Image
                src="/tree.svg"
                alt="Digital Tree"
                width={390}
                height={844}
                className="block"
            />

            {/* Leaves container */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
                style={{ width: 390, height: 844 }}
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
                                transform: "translate(-50%, -50%)",  // moves center to the x/y point
                            }}
                        />
                    ))}
            </div>


            {/* Show / hide leaf area */}
            {/* <div
                className="absolute top-0 left-1/2 -translate-x-1/2 z-20 border-2 border-blue-400"
                style={{
                    width: RECTANGLE_BOUNDS.width,
                    height: RECTANGLE_BOUNDS.height,
                    top: RECTANGLE_BOUNDS.top,
                }}
            ></div>
            <div
                className="absolute left-1/2 -translate-x-1/2 z-20  border-2 border-blue-400"
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${TRIANGLE_BOUNDS.baseWidth / 2}px solid transparent`,  // half the base width
                    borderRight: `${TRIANGLE_BOUNDS.baseWidth / 2}px solid transparent`, // half the base width
                    borderBottom: `${TRIANGLE_BOUNDS.height}px solid rgba(59, 130, 246, 0.3)`, // height + color
                    top: TRIANGLE_BOUNDS.top, // position relative to the tree image
                }}
            ></div> */}

            {/* Icons container (absolute positioned over the tree) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" style={{ width: 390, height: 844 }}>

                <TreeIcon src="/logos/pixel-nina.png" alt="Nina Protocol" x={245} y={68} href="https://www.ninaprotocol.com/profiles/mopps" />
                <TreeIcon src="/logos/pixel-instagram.png" alt="Instagram" x={45} y={205} href="https://www.instagram.com/1mopps/" />
                <TreeIcon src="/logos/pixel-youtube.png" alt="YouTube" x={260} y={330} href="https://www.youtube.com/@1mopps" />
                <TreeIcon src="/logos/pixel-apple-music.png" alt="Apple Music" x={15} y={430} href="https://music.apple.com/us/artist/mopps/1806008028" />
                <TreeIcon src="/logos/pixel-spotify.png" alt="Spotify" x={280} y={470} href="https://open.spotify.com/artist/2YUzyns9zlpImOOawZCOwq?si=OoNFH0BnQUuxDr_5Spu2XA" />

            </div>
        </div>


    );
}
