import Image from "next/image";
import Link from "next/link";
import PageModule from "../src/modules/PageModule";

export default function Home() {
  return (
    <PageModule
      title="300"
      className="w-full h-screen flex items-center justify-center"
    >
      <Image
        src="/home.jpg"
        alt="Anime girl"
        width={400}
        height={800}
        className="w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Link href="/game" className="text-5xl text-blue-700">
          Aiziet
        </Link>
      </div>
    </PageModule>
  );
}
