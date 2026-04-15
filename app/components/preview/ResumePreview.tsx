"use client";

import { ResumeData } from "@/app/types/resume";

interface Props {
  data: ResumeData;
}

function ProgressBar({ level }: { level: number }) {
  return (
    <div className="w-full h-1.5 bg-white/20 rounded-full mt-1">
      <div
        className="h-1.5 bg-white rounded-full"
        style={{ width: `${level}%` }}
      />
    </div>
  );
}

export function ResumePreview({ data }: Props) {
  const { personalDetails, profile, employmentHistory, skills, languages, hobbies } = data;

  return (
    <div
      className="w-full bg-white shadow-xl text-[8px] leading-tight font-sans"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="flex min-h-full">
        {/* Main content */}
        <div className="flex-[2] p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            {personalDetails.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={personalDetails.photoUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-gray-500 text-lg font-bold">
                {personalDetails.fullName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {personalDetails.fullName || "Your Name"}
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5">
                {personalDetails.jobTitle}
              </p>
            </div>
          </div>

          {/* Profile */}
          {profile && (
            <section className="mb-5">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                Profile
              </h2>
              <p className="text-[8px] text-gray-700 leading-relaxed">{profile}</p>
            </section>
          )}

          {/* Employment History */}
          {employmentHistory.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                Employment History
              </h2>
              <div className="space-y-4">
                {employmentHistory.map((entry) => (
                  <div key={entry.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[9px] font-bold text-gray-900">
                        {entry.jobTitle}
                        {entry.employer && `, ${entry.employer}`}
                        {entry.city && `, ${entry.city}`}
                      </h3>
                    </div>
                    <p className="text-[7px] uppercase tracking-wider text-gray-400 mt-0.5 mb-1.5">
                      {entry.startDate}
                      {entry.startDate && " — "}
                      {entry.current ? "Present" : entry.endDate}
                    </p>
                    {entry.bullets.length > 0 && (
                      <ul className="space-y-0.5">
                        {entry.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className="flex gap-1.5 text-[8px] text-gray-700"
                          >
                            <span className="mt-0.5 flex-shrink-0">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div
          className="w-32 flex-shrink-0 p-4 text-white"
          style={{ backgroundColor: "#1e3a5f" }}
        >
          {/* Details */}
          {(personalDetails.address || personalDetails.phone || personalDetails.email) && (
            <section className="mb-5">
              <h2 className="text-[8px] font-bold uppercase tracking-widest text-white mb-2">
                Details
              </h2>
              <div className="space-y-1.5">
                {personalDetails.address && (
                  <p className="text-[7px] text-white/80 leading-snug">
                    {personalDetails.address}
                  </p>
                )}
                {personalDetails.phone && (
                  <p className="text-[7px] text-white/80">{personalDetails.phone}</p>
                )}
                {personalDetails.email && (
                  <p className="text-[7px] text-white/80 break-all">
                    {personalDetails.email}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[8px] font-bold uppercase tracking-widest text-white mb-2">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <p className="text-[7px] text-white/90">{skill.name}</p>
                    <ProgressBar level={skill.level} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[8px] font-bold uppercase tracking-widest text-white mb-2">
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <p className="text-[7px] text-white/90">{lang.name}</p>
                    <ProgressBar level={lang.level} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hobbies */}
          {hobbies.length > 0 && (
            <section>
              <h2 className="text-[8px] font-bold uppercase tracking-widest text-white mb-2">
                Hobbies
              </h2>
              <p className="text-[7px] text-white/80 leading-relaxed">
                {hobbies.join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
