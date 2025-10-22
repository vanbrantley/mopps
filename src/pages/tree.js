import Image from "next/image";

export default function Tree() {
    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <Image src="/tree.svg" alt="Digital Tree" width={390} height={844} />
        </div>
    );
}
