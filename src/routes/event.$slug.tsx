// import { createFileRoute, Link, useParams } from "@tanstack/react-router";
// import { SiteNav } from "@/components/site/SiteNav";
// import { SiteFooter } from "@/components/site/SiteFooter";
// import { EVENTS, PHOTOS } from "@/lib/mock/data";

// export const Route = createFileRoute("/event/$slug")({
//   head: ({ params }) => {
//     const ev = EVENTS.find((e) => e.slug === params.slug) ?? EVENTS[0];
//     return {
//       meta: [
//         { title: `${ev.title} — DearMemory` },
//         { name: "description", content: `${ev.subtitle} · ${ev.date}. View the full gallery on DearMemory.` },
//         { property: "og:title", content: ev.title },
//         { property: "og:description", content: `${ev.subtitle} · ${ev.date}` },
//         { property: "og:image", content: ev.cover },
//       ],
//     };
//   },
//   component: Event,
// });

// const GALLERY = [
//   PHOTOS.weddingHero, PHOTOS.weddingCouple, PHOTOS.weddingFlowers, PHOTOS.weddingDetails,
//   PHOTOS.weddingDance, PHOTOS.portfolio1, PHOTOS.portfolio2, PHOTOS.portfolio3,
//   PHOTOS.weddingFlowers, PHOTOS.weddingHero, PHOTOS.weddingDetails, PHOTOS.weddingDance,
// ];

// function Event() {
//   const { slug } = useParams({ from: "/event/$slug" });
//   const ev = EVENTS.find((e) => e.slug === slug) ?? EVENTS[0];

//   return (
//     <div className="bg-background">
//       <SiteNav />
//       {/* Hero */}
//       <header className="relative">
//         <div className="aspect-[16/10] md:aspect-[21/9] overflow-hidden">
//           <img src={ev.cover} alt="" className="w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/10 to-foreground/60" />
//         </div>
//         <div className="absolute inset-0 flex items-end">
//           <div className="container mx-auto px-6 pb-16 text-white">
//             <div className="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">{ev.type}</div>
//             <h1 className="text-4xl md:text-7xl font-bold tracking-tight">{ev.title}</h1>
//             <p className="font-serif italic text-xl md:text-3xl mt-3 opacity-90">{ev.subtitle}</p>
//             <p className="text-sm mt-4 opacity-70 uppercase tracking-widest">{ev.date}</p>
//           </div>
//         </div>
//       </header>

//       {/* Toolbar */}
//       <div className="sticky top-[57px] z-40 bg-background/80 backdrop-blur-md border-b border-border">
//         <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-2 bg-white rounded-full ring-1 ring-border px-4 py-2 flex-1 max-w-md">
//             <span className="text-emerald font-bold text-xs">AI</span>
//             <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-warm-gray" placeholder="Find yourself in this gallery…" />
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="hidden md:inline px-4 py-2 rounded-full ring-1 ring-border bg-white text-sm font-semibold hover:bg-cream">Favorites</button>
//             <button className="hidden md:inline px-4 py-2 rounded-full ring-1 ring-border bg-white text-sm font-semibold hover:bg-cream">Share</button>
//             <button className="px-4 py-2 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-deep">Download all</button>
//           </div>
//         </div>
//       </div>

//       {/* Story chapter */}
//       <section className="py-20">
//         <div className="container mx-auto px-6 max-w-3xl text-center">
//           <div className="text-xs font-bold uppercase tracking-widest text-emerald mb-4">Chapter I</div>
//           <h2 className="font-serif italic text-3xl md:text-5xl leading-tight">"The way you held her hand told us everything we needed to know."</h2>
//         </div>
//       </section>

//       {/* Gallery */}
//       <section className="container mx-auto px-6 pb-24">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {GALLERY.map((src, i) => (
//             <div key={i} className={`rounded-2xl overflow-hidden ${i % 5 === 0 ? "row-span-2" : ""}`}>
//               <img src={src} alt="" className={`w-full object-cover ${i % 5 === 0 ? "aspect-[3/4] h-full" : "aspect-square"} hover:scale-105 transition-transform duration-700`} loading="lazy" />
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Guestbook */}
//       <section className="py-24 bg-emerald-light/40">
//         <div className="container mx-auto px-6 max-w-3xl">
//           <div className="text-center mb-12">
//             <div className="text-xs font-bold uppercase tracking-widest text-emerald mb-3">Guestbook</div>
//             <h2 className="text-3xl md:text-5xl font-bold">Notes from the day</h2>
//           </div>
//           <div className="space-y-4 mb-10">
//             {[
//               { name: "Mom", text: "I cried watching you walk down the aisle. I'll never forget the look on your face." },
//               { name: "Marco", text: "Best wedding ever! The food, the dancing, the love — perfect." },
//               { name: "Léa", text: "Thank you for letting us be part of your day. We love you both." },
//             ].map((n, i) => (
//               <div key={i} className="bg-white rounded-3xl p-6 ring-1 ring-border">
//                 <p className="font-serif italic text-lg mb-3">"{n.text}"</p>
//                 <div className="text-sm font-bold text-warm-gray">— {n.name}</div>
//               </div>
//             ))}
//           </div>
//           <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
//             <input className="w-full mb-3 bg-cream rounded-2xl px-4 py-3 text-sm outline-none" placeholder="Your name" />
//             <textarea rows={3} className="w-full mb-4 bg-cream rounded-2xl px-4 py-3 text-sm outline-none" placeholder="Leave a note…" />
//             <button type="button" className="bg-emerald text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-deep transition-colors">Sign guestbook</button>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 text-center container mx-auto px-6">
//         <p className="text-warm-gray mb-4">Photographed by</p>
//         <Link to="/studio/$slug" params={{ slug: "goldenhour" }} className="text-2xl font-bold text-emerald hover:underline">Goldenhour Studio</Link>
//       </section>

//       <SiteFooter />
//     </div>
//   );
// }


import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { eventsAPI, photosAPI } from "@/lib/api/client";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Heart, Share2, Download, Search } from "lucide-react";

export const Route = createFileRoute("/event/$slug")({
  head: () => ({ meta: [{ title: "Gallery — DearMemory" }] }),
  component: EventGallery,
});

function EventGallery() {
  const { slug } = useParams({ from: "/event/$slug" });
  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await eventsAPI.getBySlug(slug);
        const photosData = await photosAPI.list(eventData.id);

        setEvent(eventData);
        setPhotos(photosData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">{error || "Event not found"}</div>
      </div>
    );
  }

  // Group photos for different sections (you can adjust this logic as needed)
  const heroPhotos = photos.slice(0, 1);
  const chapterOnePhotos = photos.slice(1, 5);
  const chapterTwoPhotos = photos.slice(5, 9);
  const chapterThreePhotos = photos.slice(9);

  return (
    <div className="min-h-screen bg-white">
      {lightboxOpen && (
        <ImageLightbox
          images={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onFavorite={() => {}}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald" />
            <span className="font-bold">DearMemory</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-600">
            <a href="/">Templates</a>
            <a href="/">Showcase</a>
            <a href="/">Features</a>
            <a href="/">Pricing</a>
          </div>
          <div className="flex gap-2">
            <a href="/dashboard" className="text-sm text-gray-600">Dashboard</a>
            <button className="px-4 py-2 bg-emerald text-white rounded-full text-sm font-semibold">Logout</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="relative h-96 md:h-[600px] mt-16 bg-black/40"
        style={{
          backgroundImage: `url(http://localhost:8000${event.cover_image || "/placeholder.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs uppercase tracking-widest opacity-75 mb-4">{event.type}</div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl md:text-2xl italic opacity-90">{event.subtitle}</p>
            <p className="text-sm opacity-75 mt-6">
              {new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 items-start md:items-center justify-between">
          <div className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Find yourself in this gallery…"
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50">
              <Heart size={16} />
              Favorites
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50">
              <Share2 size={16} />
              Share
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-emerald text-white rounded-full text-sm font-semibold hover:bg-emerald-deep">
              <Download size={16} />
              Download all
            </button>
          </div>
        </div>

        {/* Chapter I */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-emerald mb-6">Chapter I</div>
            <p className="text-4xl md:text-5xl italic text-gray-900 max-w-4xl mx-auto leading-relaxed">
              "{event.description || event.subtitle}"
            </p>
          </div>
          {chapterOnePhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chapterOnePhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setLightboxIndex(photos.indexOf(photo));
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={`http://localhost:8000${photo.url}`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chapter II */}
        {chapterTwoPhotos.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-widest text-emerald mb-6">Chapter II</div>
              <p className="text-4xl md:text-5xl italic text-gray-900 max-w-4xl mx-auto leading-relaxed">
                The story unfolds
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chapterTwoPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setLightboxIndex(photos.indexOf(photo));
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={`http://localhost:8000${photo.url}`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter III */}
        {chapterThreePhotos.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-widest text-emerald mb-6">Chapter III</div>
              <p className="text-4xl md:text-5xl italic text-gray-900 max-w-4xl mx-auto leading-relaxed">
                Forever captured
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chapterThreePhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setLightboxIndex(photos.indexOf(photo));
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={`http://localhost:8000${photo.url}`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Photos Grid */}
        {photos.length > 0 && (
          <div className="mt-20 pt-20 border-t border-gray-200">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">All Photos</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={`http://localhost:8000${photo.url}`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-12 mt-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} DearMemory. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}