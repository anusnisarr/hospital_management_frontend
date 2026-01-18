import { User, Phone, Mail, MapPin, Calendar, Activity } from 'lucide-react';

export default function PatientHeader({ patient }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-6">
      <div className="flex items-start justify-between mb-6">
        {/* Left: Patient Info */}
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-3xl font-black">
              {patient.fullName?.charAt(0) || 'P'}
            </span>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-2">
              {patient.fullName}
            </h1>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <InfoItem icon={User} label="Age & Gender" value={`${patient.age}y • ${patient.gender}`} />
              <InfoItem icon={Phone} label="Phone" value={patient.phone} />
              <InfoItem icon={Mail} label="Email" value={patient.email || 'N/A'} />
              <InfoItem icon={MapPin} label="Address" value={patient.address || 'N/A'} />
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="text-right">
          <div className="bg-indigo-50 rounded-xl p-4 mb-3">
            <div className="text-3xl font-black text-indigo-600">{patient.totalVisits || 0}</div>
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Total Visits</div>
          </div>
          
          {patient.lastVisit && (
            <div className="text-xs text-slate-500">
              <Calendar className="w-3 h-3 inline mr-1" />
              Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Emergency Contact</span>
          </div>
          <p className="text-sm font-bold text-amber-900">
            {patient.emergencyContact} • {patient.emergencyPhone}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <div>
        <span className="text-xs text-slate-500">{label}: </span>
        <span className="text-sm font-semibold text-slate-900">{value}</span>
      </div>
    </div>
  );
}