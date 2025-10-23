import Image from "next/image";
import { useEffect, useState } from "react";
import TreeIcon from "@/components/TreeIcon";

export default function Tree() {

    const [leaves, setLeaves] = useState([]);

    // // using json tree data
    // useEffect(() => {
    //     fetch("/leaves_1000.json")
    //         .then((res) => res.json())
    //         .then((data) => setLeaves(data));
    // }, []);

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
                            }}
                        />
                    ))}
            </div>

            {/* Icons container (absolute positioned over the tree) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" style={{ width: 390, height: 844 }}>

                <TreeIcon src="/logos/pixel-spotify.png" alt="Spotify" x={230} y={68} href="https://open.spotify.com/artist/2YUzyns9zlpImOOawZCOwq?si=OoNFH0BnQUuxDr_5Spu2XA" />
                <TreeIcon src="/logos/pixel-apple-music.png" alt="Apple Music" x={15} y={430} href="https://music.apple.com/us/artist/mopps/1806008028" />
                <TreeIcon src="/logos/pixel-youtube.png" alt="YouTube" x={215} y={290} href="https://www.youtube.com/@1mopps" />
                <TreeIcon src="/logos/pixel-instagram.png" alt="Instagram" x={260} y={390} href="https://www.instagram.com/1mopps/" />
                <TreeIcon src="/logos/pixel-nina.png" alt="Nina Protocol" x={220} y={630} href="https://www.ninaprotocol.com/profiles/mopps" />

                {/* Spotify Icon */}
                {/* <a
                    href="https://open.spotify.com/artist/2YUzyns9zlpImOOawZCOwq?si=OoNFH0BnQUuxDr_5Spu2XA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "68px", left: "230px" }}
                >
                    <Image src="/logos/pixel-spotify.png" alt="Spotify" width={90} height={90} />
                </a> */}

                {/* Apple Music Icon */}
                {/* <a
                    href="https://music.apple.com/us/artist/mopps/1806008028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "430px", left: "15px" }}
                >
                    <Image src="/logos/pixel-apple-music.png" alt="Apple Music" width={75} height={75} />
                </a> */}

                {/* YouTube Icon */}
                {/* <a
                    href="https://www.youtube.com/@1mopps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "290px", left: "215px" }}
                >
                    <Image src="/logos/pixel-youtube.png" alt="Apple Music" width={90} height={90} />
                </a> */}

                {/* Instagram Icon */}
                {/* <a
                    href="https://www.instagram.com/1mopps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "390px", left: "260px" }}
                >
                    <Image src="/logos/pixel-instagram.png" alt="Instagram" width={90} height={90} />
                </a> */}

                {/* Nina Protocol Icon */}
                {/* <a
                    href="https://www.ninaprotocol.com/profiles/mopps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "630px", left: "220px" }}
                >
                    <Image src="/logos/pixel-nina.png" alt="Nina Protocol" width={90} height={90} />
                </a> */}


            </div>
        </div>


    );
}
