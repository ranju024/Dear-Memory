import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { eventsAPI, photosAPI } from "@/lib/api/client";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/media")({
  head: () => ({ meta: [{ title: "Media Library — DearMemory" }] }),
  component: Media,
});

function Media() {
  const [events, setEvents] = useState<any[]>([]);
  const [allPhotos, setAllPhotos] = useState<any[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all events
        const eventsData = await eventsAPI.list();
        setEvents(eventsData || []);

        // Fetch photos from all events
        const allPhotosData: any[] = [];
        if (eventsData && eventsData.length > 0) {
          for (const event of eventsData) {
            const photos = await photosAPI.list(event.id);
            if (photos) {
              allPhotosData.push(
                ...photos.map((p: any) => ({ ...p, event_title: event.title, event_id: event.id }))
              );
            }
          }
        }

        setAllPhotos(allPhotosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load media");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter photos based on collection and event
  useEffect(() => {
    let filtered = allPhotos;

    // Filter by collection
    if (activeCollection === "favorites") {
      filtered = filtered.filter((p) => p.favorites > 0);
    } else if (activeCollection === "recent") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    // Filter by event
    if (activeEvent) {
      filtered = filtered.filter((p) => p.event_id === activeEvent);
    }

    setFilteredPhotos(filtered);
  }, [allPhotos, activeCollection, activeEvent]);

  const stats = {
    total: allPhotos.length,
    favorites: allPhotos.filter((p) => p.favorites > 0).length,
    recent: allPhotos.filter(
      (p) =>
        new Date(p.created_at).getTime() >
        Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
    totalFavorites: allPhotos.reduce((sum, p) => sum + p.favorites, 0),
    totalDownloads: allPhotos.reduce((sum, p) => sum + p.downloads, 0),
  };

  if (loading) {
    return (
      <AppShell title="Media Library" subtitle="Loading...">
        <div className="text-center py-12">Loading media library...</div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="Media Library" subtitle="Error">
        <div className="text-center py-12 text-red-600">{error}</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Media Library"
      subtitle={`${stats.total.toLocaleString()} photos across ${events.length} events`}
      action={
        <div className="flex gap-2">
          <button className="bg-white ring-1 ring-border px-4 py-2 rounded-full text-sm font-semibold hover:bg-cream">
            + Folder
          </button>
          <button className="bg-emerald text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-deep">
            ↑ Upload
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 bg-white rounded-[1.5rem] ring-1 ring-border p-5 h-fit">
          <div className="font-bold text-sm mb-3">Collections</div>
          <div className="space-y-1 text-sm">
            {[
              { id: "all", label: "All photos", count: stats.total },
              { id: "recent", label: "Recent uploads", count: stats.recent },
              { id: "favorites", label: "Favorites", count: stats.favorites },
            ].map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveCollection(c.id);
                  setActiveEvent(null);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer ${
                  activeCollection === c.id && activeEvent === null
                    ? "bg-emerald-light text-emerald-deep font-semibold"
                    : "hover:bg-cream"
                }`}
              >
                <span>{c.label}</span>
                <span className="text-xs text-warm-gray font-mono">
                  {c.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="font-bold text-sm mt-6 mb-3">By event</div>
          <div className="space-y-1 text-sm">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setActiveEvent(event.id);
                  setActiveCollection("all");
                }}
                className={`px-3 py-2 rounded-xl cursor-pointer ${
                  activeEvent === event.id
                    ? "bg-emerald-light text-emerald-deep font-semibold"
                    : "hover:bg-cream"
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-xs font-semibold text-warm-gray mb-3">STATS</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Favorites</span>
                <span className="font-mono font-semibold">
                  {stats.totalFavorites}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Downloads</span>
                <span className="font-mono font-semibold">
                  {stats.totalDownloads}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Gallery */}
        <div className="col-span-12 lg:col-span-9">
          {filteredPhotos.length === 0 ? (
            <div className="text-center py-12 text-warm-gray">No photos found</div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-xl overflow-hidden group relative"
                >
                  <img
                    src={`http://localhost:8000${photo.url}`}
                    alt={photo.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-emerald/0 group-hover:bg-emerald/20 transition-colors" />

                  {/* Hover info */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-end justify-start p-2 opacity-0 group-hover:opacity-100">
                    <button className="p-1 bg-red-500/80 hover:bg-red-600 text-white rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Stats tooltip */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <div className="flex justify-between">
                      <span>❤️ {photo.favorites}</span>
                      <span>⬇️ {photo.downloads}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}