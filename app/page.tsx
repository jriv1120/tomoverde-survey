import Image from "next/image";
import Link from "next/link";
import DisclosureFooter from "@/components/DisclosureFooter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-16">
        <div className="max-w-2xl w-full text-center animate-settle">
          <div className="mx-auto mb-8 w-[320px] sm:w-[400px]">
            <Image
              src="/logo.png"
              alt="Tomoverde — Discover Green Together"
              width={760}
              height={580}
              priority
              className="w-full h-auto"
            />
          </div>

          <h1 className="mt-10 sm:mt-12 font-serif text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] tracking-tight text-ink">
            Tell us what you{" "}
            <em className="text-forest not-italic font-serif italic">actually</em> want.
          </h1>

          <p className="mt-8 font-serif text-lg sm:text-xl text-ink/75 leading-relaxed max-w-xl mx-auto font-light">
            New Jersey&rsquo;s green scene, built by people who know hospitality. Events
            worth your time, venues worth knowing, and a scene that&rsquo;s actually fun to
            be part of.
          </p>

          <p className="mt-6 text-base text-ink-muted leading-relaxed max-w-md mx-auto">
            Thirteen quick questions. Your answers shape every event we put on.
          </p>

          <div className="mt-14">
            <Link
              href="/survey"
              className="inline-flex items-center gap-3 rounded-full bg-forest hover:bg-ink transition-colors duration-500 ease-out px-9 py-4 text-cream font-medium shadow-xl shadow-forest/20"
            >
              <span>Start the survey</span>
              <span aria-hidden>→</span>
            </Link>
            <p className="mt-5 text-sm text-ink-muted">Takes about 90 seconds.</p>
          </div>
        </div>
      </div>

      <DisclosureFooter />
    </main>
  );
}
