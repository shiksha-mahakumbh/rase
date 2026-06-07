import GlassCard from "./home/GlassCard";
import { ConferenceIcon } from "./home/icons";

const events = [
  { id: "1", title: "Registration Open for Shiksha Mahakumbh 6.0" },
  { id: "2", title: "Workshops & Volunteer Orientation – Starting Soon" },
  { id: "3", title: "Sponsorship Window Now Open" },
  { id: "4", title: "Project Display Registration Begins" },
  { id: "5", title: "Accommodation Details Will Be Released Soon" },
] as const;

export default function NoticeBoard() {
  return (
    <div className="px-3 py-6 md:px-6 md:py-8">
      <div className="mb-6 text-center md:mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/60">
          Stay Updated
        </p>
        <h2 className="home-section-title text-2xl md:text-3xl">
          Latest Notices
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <div key={event.id}>
            <GlassCard className="home-card-hover group cursor-pointer border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <ConferenceIcon className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-semibold leading-snug text-gray-800 transition-colors group-hover:text-primary md:text-lg">
                    {event.title}
                  </h3>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
