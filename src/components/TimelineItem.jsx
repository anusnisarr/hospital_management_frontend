import { Calendar, Clock, Pill, FileText, AlertCircle } from 'lucide-react';

export default function TimelineItem({ visit, isFirst, isLast }) {
  const statusColors = {
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    cancelled: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  };

  const colors = statusColors[visit.status?.toLowerCase()] || statusColors.pending;

  return (
    <div className="flex gap-6 group">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className={`w-4 h-4 ${colors.dot} rounded-full border-4 border-white shadow-md z-10 group-hover:scale-125 transition-transform`}></div>
        
        {/* Connecting Line */}
        {!isLast && (
          <div className="w-0.5 h-full bg-slate-200 -mt-1"></div>
        )}
      </div>

      {/* Content Card */}
      <div className={`flex-1 pb-8 ${isLast ? '' : 'pb-8'}`}>
        <div className={`bg-white border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-all`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-slate-900 text-white text-xs font-black rounded-lg">
                  #{visit.tokenNo}
                </span>
                <span className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-bold rounded-full border ${colors.border}`}>
                  {visit.status}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{visit.appointmentType}</h3>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                <Calendar className="w-4 h-4" />
                {new Date(visit.registrationDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {visit.registrationTime}
              </div>
            </div>
          </div>

          {/* Medical History */}
          {visit.medicalHistory && visit.medicalHistory.length > 0 && (
            <div className="space-y-4">
              {visit.medicalHistory.map((record, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {/* Diagnosis */}
                  {record.diagnosis && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Diagnosis</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{record.diagnosis}</p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {record.symptoms && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Symptoms</span>
                      </div>
                      <p className="text-sm text-slate-700">{record.symptoms}</p>
                    </div>
                  )}

                  {/* Medicines */}
                  {record.medicines && record.medicines.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Prescribed Medicines</span>
                      </div>
                      <div className="space-y-2">
                        {record.medicines.map((med, medIdx) => (
                          <div key={medIdx} className="bg-white rounded-lg p-3 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">{med.name}</div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                              <div>
                                <span className="text-slate-400">Dosage:</span> {med.dosage}
                              </div>
                              <div>
                                <span className="text-slate-400">Frequency:</span> {med.frequency}
                              </div>
                              <div>
                                <span className="text-slate-400">Duration:</span> {med.duration}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {record.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-600 italic">{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Medical History */}
          {(!visit.medicalHistory || visit.medicalHistory.length === 0) && (
            <div className="text-center py-6 text-slate-400 text-sm">
              No medical records for this visit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}