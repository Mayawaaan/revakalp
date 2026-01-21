import React, { useState, useEffect } from "react";
import Title from "../../components/globalComponents/Title";
import { ChevronRight, MapPin, Briefcase } from "lucide-react";

const ExploreJobs = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: "Senior Full Stack Developer",
      location: "New York",
      department: "Engineering",
      locationType: "Remote / New York",
      description:
        "We are looking for an experienced Full Stack Developer to build scalable and elegant web applications."
    },
    {
      id: 2,
      title: "UI/UX Designer",
      location: "London",
      department: "Design",
      locationType: "London, UK",
      description:
        "Join our design team to create intuitive and visually engaging user experiences."
    },
    {
      id: 3,
      title: "Digital Marketing Manager",
      location: "Remote",
      department: "Marketing",
      locationType: "Remote",
      description:
        "Lead our digital campaigns, brand growth and online acquisition strategy."
    }
  ]);

  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [showFilter, setShowFilter] = useState(false);
  const [locationFilter, setLocationFilter] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState([]);

  const toggle = (value, state, setState) => {
    state.includes(value)
      ? setState(state.filter((v) => v !== value))
      : setState([...state, value]);
  };

  const applyFilter = () => {
    let data = [...jobs];
    if (locationFilter.length)
      data = data.filter((j) => locationFilter.includes(j.location));
    if (departmentFilter.length)
      data = data.filter((j) => departmentFilter.includes(j.department));
    setFilteredJobs(data);
  };

  useEffect(() => {
    applyFilter();
  }, [locationFilter, departmentFilter]);

  return (
    <section className="bg-[#fffafc] min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">
          <Title text1="EXPLORE" text2="JOBS" />
          <p className="text-pink-700 mt-4">
            Join Revakalp and help build India’s most loved textile brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">

          {/* Filters */}
          <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-28 h-fit">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            >
              <h3 className="font-serif text-lg text-pink-900">Filters</h3>
              <ChevronRight
                className={`md:hidden transition ${
                  showFilter ? "rotate-90" : ""
                }`}
              />
            </div>

            <div className={`mt-6 space-y-8 ${showFilter ? "" : "hidden md:block"}`}>

              {/* Location */}
              <div>
                <p className="text-sm font-medium text-pink-700 mb-3">Location</p>
                {["New York", "London", "Remote"].map((loc) => (
                  <label key={loc} className="flex gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={locationFilter.includes(loc)}
                      onChange={() => toggle(loc, locationFilter, setLocationFilter)}
                      className="accent-pink-600"
                    />
                    {loc}
                  </label>
                ))}
              </div>

              {/* Department */}
              <div>
                <p className="text-sm font-medium text-pink-700 mb-3">Department</p>
                {["Engineering", "Design", "Marketing"].map((dep) => (
                  <label key={dep} className="flex gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={departmentFilter.includes(dep)}
                      onChange={() =>
                        toggle(dep, departmentFilter, setDepartmentFilter)
                      }
                      className="accent-pink-600"
                    />
                    {dep}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs */}
          <div className="space-y-8">
            <p className="text-sm text-pink-700">
              Showing {filteredJobs.length} open positions
            </p>

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-start gap-6">
                  <div>
                    <h3 className="text-xl font-serif text-pink-900">
                      {job.title}
                    </h3>
                    <div className="flex gap-6 text-sm text-pink-700 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {job.locationType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={14} /> {job.department}
                      </span>
                    </div>
                  </div>

                  <button className="bg-pink-700 text-white px-6 py-2 rounded-full">
                    Apply
                  </button>
                </div>

                <p className="text-gray-600 mt-6 leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExploreJobs;
