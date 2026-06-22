import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — DearMemory" }] }),
  component: Settings,
});

const TABS = ["Studio", "Domains", "Billing", "Notifications", "Integrations", "Security"];

function Settings() {
  return (
    <AppShell title="Settings" subtitle="Manage your studio.">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-[1.5rem] ring-1 ring-border p-3">
            {TABS.map((t, i) => (
              <div key={t} className={`px-4 py-2.5 rounded-xl text-sm cursor-pointer ${i === 0 ? "bg-emerald-light text-emerald-deep font-semibold" : "hover:bg-cream"}`}>
                {t}
              </div>
            ))}
          </div>
        </aside>
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
            <div className="font-bold mb-1">Studio profile</div>
            <div className="text-sm text-warm-gray mb-6">Public information about your studio.</div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Studio name" value="Goldenhour Studio" />
              <Field label="Subdomain" value="goldenhour.dearmemory.com" />
              <Field label="Contact email" value="hello@goldenhour.studio" />
              <Field label="Phone" value="+351 912 345 678" />
            </div>
            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-widest text-warm-gray block mb-2">About</label>
              <textarea rows={4} defaultValue="We are a small studio in Lisbon documenting weddings, intimate gatherings, and brand stories across Europe." className="w-full bg-cream rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald/30" />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 ring-1 ring-border">
            <div className="font-bold mb-1">Notifications</div>
            <div className="text-sm text-warm-gray mb-6">Stay in the loop without being overwhelmed.</div>
            <div className="space-y-3">
              {[
                { l: "New lead notifications", on: true },
                { l: "Guestbook entries", on: true },
                { l: "Weekly traffic digest", on: true },
                { l: "Product updates", on: false },
              ].map((s) => (
                <div key={s.l} className="flex items-center justify-between p-3 rounded-2xl hover:bg-cream">
                  <span className="text-sm">{s.l}</span>
                  <div className={`w-11 h-6 rounded-full ${s.on ? "bg-emerald" : "bg-border"} relative transition-colors cursor-pointer`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${s.on ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald rounded-[2rem] p-6 text-white flex items-center justify-between">
            <div>
              <div className="font-bold">Studio plan · Creative</div>
              <div className="text-xs text-white/70 mt-1">$29 / month · Renews March 12</div>
            </div>
            <button className="bg-white text-emerald px-5 py-2.5 rounded-full text-sm font-semibold">Manage plan</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-warm-gray block mb-2">{label}</label>
      <input defaultValue={value} className="w-full bg-cream rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald/30" />
    </div>
  );
}
