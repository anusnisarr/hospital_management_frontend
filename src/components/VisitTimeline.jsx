import TimelineItem from './TimelineItem';

export default function VisitTimeline({ visits }) {
  if (!visits || visits.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Visit History</h3>
        <p className="text-slate-500">This patient hasn't had any visits yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight mb-8">
        Visit History ({visits.length})
      </h2>

      <div className="relative">
        {visits.map((visit, index) => (
          <TimelineItem
            key={visit._id}
            visit={visit}
            isFirst={index === 0}
            isLast={index === visits.length - 1}
          />
        ))}
      </div>
    </div>
  );
}