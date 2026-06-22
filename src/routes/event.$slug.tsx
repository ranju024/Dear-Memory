import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EVENTS, PHOTOS } from "@/lib/mock/data";

export const Route = createFileRoute("/event/$slug")({
  head: ({ params }) => {
    const ev = EVENTS.find((e) => e.slug === params.slug) ?? EVENTS[0];
    return {
      meta: [
        { title: `${ev.title} — DearMemory` },
        { name: "description", content: `${ev.subtitle} · ${ev.date}. View the full gallery on DearMemory.` },
        { property: "og:title", content: ev.title },
        { property: "og:description", content: `${ev.subtitle} · ${ev.date}` },
        { property: "og:image", content: ev.cover },
      ],
    };
  },
  component: Event,
});

const GALLERY = [
  PHOTOS.weddingHero, PHOTOS.weddingCouple, PHOTOS.weddingFlowers, PHOTOS.weddingDetails,
  PHOTOS.weddingDance, PHOTOS.portfolio1, PHOTOS.portfolio2, PHOTOS.portfolio3,
  PHOTOS.weddingFlowers, PHOTOS.weddingHero, PHOTOS.weddingDetails, PHOTOS.weddingDance,
];

function Event() {
  const { slug } = useParams({ from: "/event/$slug" });
  const ev = EVENTS.find((e) => e.slug === slug) ?? EVENTS[0];

  return (
    <div className="bg-background">
      <SiteNav />
      {/* Hero */}
      <header className="relative">
        <div className="aspect-[16/10] md:aspect-[21/9] overflow-hidden">
          <img src={ev.cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/10 to-foreground/60" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-16 text-white">
            <div className="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">{ev.type}</div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight">{ev.title}</h1>
            <p className="font-serif italic text-xl md:text-3xl mt-3 opacity-90">{ev.subtitle}</p>
            <p className="text-sm mt-4 opacity-70 uppercase tracking-widest">{ev.date}</p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="sticky top-[57px] z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full ring-1 ring-border px-4 py-2 flex-1 max-w-md">
            <span className="text-emerald font-bold text-xs">AI</span>
            <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-warm-gray" placeholder="Find yourself in this gallery…" />
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden md:inline px-4 py-2 rounded-full ring-1 ring-border bg-white text-sm font-semibold hover:bg-cream">Favorites</button>
            <button className="hidden md:inline px-4 py-2 rounded-full ring-1 ring-border bg-white text-sm font-semibold hover:bg-cream">Share</button>
            <button className="px-4 py-2 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-deep">Download all</button>
          </div>
        </div>
      </div>

      {/* Story chapter */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald mb-4">Chapter I</div>
          <h2 className="font-serif italic text-3xl md:text-5xl leading-tight">"The way you held her hand told us everything we needed to know."</h2>
        </div>
      </section>

      {/* Gallery */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GALLERY.map((src, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden ${i % 5 === 0 ? "row-span-2" : ""}`}>
              <img src={src} alt="" className={`w-full object-cover ${i % 5 === 0 ? "aspect-[3/4] h-full" : "aspect-square"} hover:scale-105 transition-transform duration-700`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Guestbook */}
      <section className="py-24 bg-emerald-light/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald mb-3">Guestbook</div>
            <h2 className="text-3xl md:text-5xl font-bold">Notes from the day</h2>
          </div>
          <div className="space-y-4 mb-10">
            {[
              { name: "Mom", text: "I cried watching you walk down the aisle. I'll never forget the look on your face." },
              { name: "Marco", text: "Best wedding ever! The food, the dancing, the love — perfect." },
              { name: "Léa", text: "Thank you for letting us be part of your day. We love you both." },
            ].map((n, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 ring-1 ring-border">
                <p className="font-serif italic text-lg mb-3">"{n.text}"</p>
                <div className="text-sm font-bold text-warm-gray">— {n.name}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
            <input className="w-full mb-3 bg-cream rounded-2xl px-4 py-3 text-sm outline-none" placeholder="Your name" />
            <textarea rows={3} className="w-full mb-4 bg-cream rounded-2xl px-4 py-3 text-sm outline-none" placeholder="Leave a note…" />
            <button type="button" className="bg-emerald text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-deep transition-colors">Sign guestbook</button>
          </div>
        </div>
      </section>

      <section className="py-16 text-center container mx-auto px-6">
        <p className="text-warm-gray mb-4">Photographed by</p>
        <Link to="/studio/$slug" params={{ slug: "goldenhour" }} className="text-2xl font-bold text-emerald hover:underline">Goldenhour Studio</Link>
      </section>

      <SiteFooter />
    </div>
  );
}
