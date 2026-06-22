import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { EVENTS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/create")({
  head: () => ({ meta: [{ title: "Create — DearMemory" }] }),
  component: CreateEvents,
});

function CreateEvents() {
  return (
    <AppShell
      title="Pick the Album Template You Love"
      action={
        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2 bg-white ring-1 ring-border rounded-full px-4 py-2 w-72">
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Search events…"
            />
          </div>
        </div>
      }
    >
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Wedding", "Graduation", "College Fest", "Corporate Event", "Conference", "Concert", "Anniversary", "Party"].map((s, i) => (
          <button
            key={s}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${i === 0 ? "bg-emerald text-white" : "bg-white ring-1 ring-border text-warm-gray hover:bg-cream"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map((e) => (
          <div
            key={e.id}
            className="rounded-lg overflow-hidden ring-1 ring-border group cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={e.cover}
                alt={e.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={`/event/${e.slug}`}
                  className="px-5 py-2.5 rounded-full bg-white/90 text-warm-gray text-sm font-semibold hover:bg-white transition-colors"
                >
                  View
                </a>
                <a
                  href="/album-editor"
                  className="px-5 py-2.5 rounded-full bg-emerald text-white text-sm font-semibold hover:bg-emerald-deep transition-colors"
                >
                  Edit
                </a>
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="font-bold text-lg">{e.title}</div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
