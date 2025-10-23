import Image from "next/image";
import { useState } from "react";

export default function TreeIcon({ src, alt, x, y, href, size = 75 }) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute transition-transform duration-150 ${isPressed ? "scale-95" : "hover:scale-110"
                }`}
            style={{ top: y, left: x, width: size, height: size }}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
        >
            <Image src={src} alt={alt} width={size} height={size} />
        </a>
    );
}
