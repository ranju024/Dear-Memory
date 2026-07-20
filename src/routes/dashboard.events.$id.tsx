import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { eventsAPI, photosAPI, analyticsAPI } from "@/lib/api/client";
import { ArrowLeft, Upload } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";

export const Route = createFileRoute("/dashboard/events/$id")({
  head: () => ({ meta: [{ title: "Event Details — DearMemory" }] }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = useParams({ from: "/dashboard/events/$id" });
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const eventId = parseInt(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventData, photosData, perfData] = await Promise.all([
          eventsAPI.get(eventId),
          photosAPI.list(eventId),
          analyticsAPI.eventPerformance(eventId),
        ]);

        setEvent(eventData);
        setPhotos(photosData || []);
        setPerformance(perfData);
        setEditData(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await eventsAPI.update(eventId, editData);
      setEvent(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      console.log("Uploading to event:", eventId);
      const newPhoto = await photosAPI.upload(eventId, file);
      console.log("Upload response:", newPhoto);
      setPhotos([...photos, newPhoto]);

      // Refetch event to update stats
      const updatedEvent = await eventsAPI.get(eventId);
      setEvent(updatedEvent);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleFavorite = async (photoId: number) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      const updated = photo?.favorites > 0 
        ? await photosAPI.unfavorite(photoId)
        : await photosAPI.favorite(photoId);

      setPhotos(photos.map((p) => (p.id === photoId ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to favorite photo");
    }
  };

  // In the photos grid section:
  {photos.length === 0 ? (
    <p className="text-warm-gray text-center py-8">No photos yet. Upload your first photo!</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="aspect-square rounded-lg overflow-hidden group relative cursor-pointer"
          onClick={() => {
            setLightboxIndex(index);
            setLightboxOpen(true);
          }}
        >
          <img
            src={`http://localhost:8000${photo.url}`}
            alt={photo.filename}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePhoto(photo.id);
            }}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

  {lightboxOpen && (
    <ImageLightbox
      images={photos}
      initialIndex={lightboxIndex}
      onClose={() => setLightboxOpen(false)}
      onFavorite={handleFavorite}
    />
  )}

  const handleDeletePhoto = async (photoId: number) => {
    if (!window.confirm("Delete this photo?")) return;
    
    try {
      await photosAPI.delete(photoId);
      setPhotos(photos.filter(p => p.id !== photoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    }
  };

  const handlePublish = async () => {
    try {
      const updated = await eventsAPI.publish(eventId);
      setEvent(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish event");
    }
  };

  if (loading) {
    return (
      <AppShell title="Event" subtitle="Loading...">
        <div className="text-center py-12">Loading event...</div>
      </AppShell>
    );
  }

  if (error || !event) {
    return (
      <AppShell title="Event" subtitle="Error">
        <div className="text-center py-12 text-red-600">{error || "Event not found"}</div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={event.title}
      subtitle={event.subtitle || "Event details and analytics"}
      action={
        <div className="flex gap-2">
          <button
            onClick={() => navigate({ to: "/dashboard/events" })}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full hover:bg-cream"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          {event.status !== "Live" && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-emerald text-white rounded-full font-semibold hover:bg-emerald-deep"
            >
              Publish
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-8">
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Event Details Section */}
        <section className="bg-white rounded-2xl ring-1 ring-border p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">Event Details</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-emerald font-semibold hover:underline"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Subtitle</label>
                <input
                  type="text"
                  value={editData.subtitle || ""}
                  onChange={(e) => handleEditChange("subtitle", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald"
                />
              </div>

              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-emerald text-white rounded-lg font-semibold hover:bg-emerald-deep"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-warm-gray">Type</label>
                <p className="text-lg">{event.type}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-warm-gray">Date</label>
                <p className="text-lg">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-warm-gray">Status</label>
                <p className="text-lg font-semibold text-emerald">{event.status}</p>
              </div>
              {event.description && (
                <div>
                  <label className="text-sm font-semibold text-warm-gray">Description</label>
                  <p className="text-lg">{event.description}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Performance Stats */}
        {performance && (
          <section className="bg-white rounded-2xl ring-1 ring-border p-6">
            <h2 className="text-2xl font-bold mb-6">Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat label="Views" value={performance.views?.toLocaleString() || "0"} />
              <Stat label="Visitors" value={performance.visitors?.toLocaleString() || "0"} />
              <Stat label="Photos" value={performance.total_photos?.toString() || "0"} />
              <Stat label="Favorites" value={performance.total_favorites?.toString() || "0"} />
            </div>
          </section>
        )}

        {/* Photos Section */}
        <section className="bg-white rounded-2xl ring-1 ring-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Photos ({photos.length})</h2>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald text-white rounded-full cursor-pointer hover:bg-emerald-deep">
              <Upload size={16} />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {uploading && <p className="text-sm text-warm-gray mb-4">Uploading...</p>}

          {photos.length === 0 ? (
            <p className="text-warm-gray text-center py-8">No photos yet. Upload your first photo!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden group relative">
                  <img
                    // src={photo.url.startsWith('http') ? photo.url : `http://localhost:8000${photo.url}`}
                    src={`http://localhost:8000${photo.url}`}                    
                    alt={photo.filename}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <button 
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >X</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-emerald">{value}</p>
      <p className="text-sm text-warm-gray mt-1">{label}</p>
    </div>
  );
}