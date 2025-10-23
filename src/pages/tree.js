import Image from "next/image";


export default function Tree() {
    return (
        // <div className="flex justify-center items-center h-screen bg-black">
        //     <Image src="/tree.svg" alt="Digital Tree" width={390} height={844} />
        // </div>

        <div className="relative flex justify-center items-center bg-black min-h-screen overflow-auto">
            {/* Tree image */}
            <Image
                src="/tree.svg"
                alt="Digital Tree"
                width={390}
                height={844}
                className="block"
            />

            {/* Icons container (absolute positioned over the tree) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: 390, height: 844 }}>

                {/* Spotify Icon */}
                <a
                    href="https://open.spotify.com/artist/2YUzyns9zlpImOOawZCOwq?si=OoNFH0BnQUuxDr_5Spu2XA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "68px", left: "230px" }}
                >
                    <Image src="/logos/pixel-spotify.png" alt="Spotify" width={90} height={90} />
                </a>

                {/* Apple Music Icon */}
                <a
                    href="https://music.apple.com/us/artist/mopps/1806008028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "430px", left: "15px" }}
                >
                    <Image src="/logos/pixel-apple-music.png" alt="Apple Music" width={75} height={75} />
                </a>

                {/* YouTube Icon */}
                <a
                    href="https://www.youtube.com/@1mopps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "290px", left: "215px" }}
                >
                    <Image src="/logos/pixel-youtube.png" alt="Apple Music" width={90} height={90} />
                </a>

                {/* Instagram Icon */}
                <a
                    href="https://www.instagram.com/1mopps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "390px", left: "260px" }}
                >
                    <Image src="/logos/pixel-instagram.png" alt="Instagram" width={90} height={90} />
                </a>

                {/* Nina Protocol Icon */}
                <a
                    href="https://www.ninaprotocol.com/profiles/mopps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                    style={{ top: "630px", left: "220px" }}
                >
                    <Image src="/logos/pixel-nina.png" alt="Nina Protocol" width={90} height={90} />
                </a>


            </div>
        </div>


    );
}
