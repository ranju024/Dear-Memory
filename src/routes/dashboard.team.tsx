import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { PHOTOS } from "@/lib/mock/data";

export const Route = createFileRoute("/dashboard/team")({
  head: () => ({ meta: [{ title: "Team — DearMemory" }] }),
  component: Team,
});

const TEAM = [
  { name: "Inês Marques", role: "Founder & Lead Photographer", avatar: PHOTOS.team1, events: 84 },
  { name: "Tomás Ribeiro", role: "Second Shooter", avatar: PHOTOS.team2, events: 41 },
  { name: "Léa Carvalho", role: "Editor", avatar: PHOTOS.team3, events: 127 },
];

function Team() {
  return (
    <AppShell
      title="Team"
      subtitle="The humans behind every photo."
      action={<button className="bg-emerald text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-deep">+ Invite</button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM.map((t) => (
          <div key={t.name} className="bg-white rounded-[2rem] p-6 ring-1 ring-border text-center">
            <img src={t.avatar} alt={t.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-emerald-light" />
            <div className="font-bold text-lg">{t.name}</div>
            <div className="text-sm text-warm-gray mb-4">{t.role}</div>
            <div className="text-xs text-warm-gray font-mono">{t.events} events</div>
          </div>
        ))}
        <button className="border-2 border-dashed border-warm-gray/30 rounded-[2rem] p-6 text-warm-gray hover:bg-cream transition-colors">
          + Invite teammate
        </button>
      </div>
    </AppShell>
  );
}
