import React, { useMemo, useState } from "react";
import { ChevronRight, MapPin, Briefcase } from "lucide-react";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";

const JOBS = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    location: "New York",
    department: "Engineering",
    locationType: "Remote / New York",
    description:
      "We are looking for an experienced Full Stack Developer to build scalable and elegant web applications.",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    location: "London",
    department: "Design",
    locationType: "London, UK",
    description:
      "Join our design team to create intuitive and visually engaging user experiences.",
  },
  {
    id: 3,
    title: "Digital Marketing Manager",
    location: "Remote",
    department: "Marketing",
    locationType: "Remote",
    description:
      "Lead our digital campaigns, brand growth and online acquisition strategy.",
  },
];

const ExploreJobs = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState([]);

  const toggle = (value, state, setState) => {
    setState(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
  };

  const filteredJobs = useMemo(() => {
    return JOBS.filter((j) => {
      if (locationFilter.length && !locationFilter.includes(j.location)) return false;
      if (departmentFilter.length && !departmentFilter.includes(j.department)) return false;
      return true;
    });
  }, [locationFilter, departmentFilter]);

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Careers"
        title="Explore Open Roles"
        subtitle="Join the team supporting Revakalp's retail and online storefront."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
          <aside className="rk-surface-card p-6 h-fit md:sticky md:top-28">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <h2 className="font-serif text-xl text-[#38131E]">Filters</h2>
              <ChevronRight
                className={`md:hidden text-[#38131E] transition-transform ${
                  showFilter ? "rotate-90" : ""
                }`}
              />
            </button>

            <div className={`mt-5 space-y-6 ${showFilter ? "block" : "hidden md:block"}`}>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mb-3">
                  Location
                </p>
                <div className="space-y-2">
                  {["New York", "London", "Remote"].map((loc) => (
                    <label key={loc} className="flex items-center gap-2.5 text-sm text-[#1A1718]/85 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locationFilter.includes(loc)}
                        onChange={() => toggle(loc, locationFilter, setLocationFilter)}
                        className="w-4 h-4 accent-[#38131E]"
                      />
                      <span>{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mb-3">
                  Department
                </p>
                <div className="space-y-2">
                  {["Engineering", "Design", "Marketing"].map((dep) => (
                    <label key={dep} className="flex items-center gap-2.5 text-sm text-[#1A1718]/85 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={departmentFilter.includes(dep)}
                        onChange={() => toggle(dep, departmentFilter, setDepartmentFilter)}
                        className="w-4 h-4 accent-[#38131E]"
                      />
                      <span>{dep}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <p className="text-sm text-[#38131E]/80 font-medium">
              Showing {filteredJobs.length} open position{filteredJobs.length === 1 ? "" : "s"}
            </p>

            {filteredJobs.map((job) => (
              <article key={job.id} className="rk-surface-card p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#38131E]">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-[#38131E]/75 mt-1.5">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} /> {job.locationType}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase size={14} /> {job.department}
                      </span>
                    </div>
                  </div>
                  <EditorialButton
                    href={`mailto:contact@revakalp.com?subject=${encodeURIComponent(
                      `Application: ${job.title}`
                    )}`}
                    variant="primary"
                  >
                    Apply via Email
                  </EditorialButton>
                </div>
                <p className="text-sm text-[#1A1718]/75 leading-relaxed">{job.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreJobs;
