import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="max-w-2xl w-full text-center animate-settle">
          <div className="mx-auto mb-6 sm:mb-8 relative w-[240px] sm:w-[300px] aspect-square flex items-center justify-center">
            <div
              aria-hidden
              className="absolute -inset-[28%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(244,237,224,0.92) 0%, rgba(244,237,224,0.62) 28%, rgba(244,237,224,0.24) 50%, rgba(244,237,224,0.06) 68%, transparent 82%)",
              }}
            />
            <Image
              src="/logo.png"
              alt="Tomoverde — where connection grows"
              width={560}
              height={560}
              priority
              className="relative w-full h-auto"
            />
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-cream">
            Tell us what you{" "}
            <em className="text-glow not-italic font-serif italic">actually</em> want.
          </h1>

          <p className="mt-10 font-serif text-lg sm:text-xl text-text-muted leading-relaxed max-w-xl mx-auto font-light">
            Tomo means friendship. Verde means green. We&rsquo;re building a cannabis community
            that feels like coming home, not a transaction.
          </p>

          <p className="mt-6 text-base text-text-muted/80 leading-relaxed max-w-md mx-auto">
            Fourteen quick questions. Your answers shape every event we put on.
          </p>

          <div className="mt-14">
            <Link
              href="/survey"
              className="inline-flex items-center gap-3 rounded-full bg-moss hover:bg-fern transition-colors duration-500 ease-out px-9 py-4 text-cream font-medium shadow-lg shadow-black/40"
            >
              <span>Start the survey</span>
              <span aria-hidden className="text-glow">
                →
              </span>
            </Link>
            <p className="mt-5 text-sm text-text-muted/70">Takes about 90 seconds.</p>
          </div>
        </div>
      </div>

      <footer className="px-6 pb-10 sm:px-10 text-center text-xs text-text-muted/50">
        Where connection grows · New Jersey
      </footer>
    </main>
  );
}
