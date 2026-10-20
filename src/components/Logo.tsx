import Image from "next/image";

// The approved repository asset is the single source for every brand placement.
export function Logo() {
  return (
    <Image
      className="brand-logo"
      src="/brand/national-rentals-logo.svg"
      alt="National Rentals"
      width={1200}
      height={350}
      unoptimized
    />
  );
}
