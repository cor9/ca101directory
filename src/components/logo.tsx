import Image from "next/image";

export function Logo() {
    return (
        <Image
            src="/logo.png"
            alt="Logo"
            title="Logo"
            width={96}
            height={96}
            className="size-8 rounded-md"
        />
    )
}
