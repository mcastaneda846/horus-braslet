import Image from "next/image";
import type { CSSProperties } from "react";

export default function EyeOfHorusIcon({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <Image
            src="/logos-horus-2.svg"
            alt="Horus"
            width={48}
            height={48}
            className={className}
            style={style}
        />
    );
}
