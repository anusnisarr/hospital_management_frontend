import { useState, useEffect, useRef, useCallback } from "react";
import { getAllTodayVisits , updateVisit } from "../api/services/visitService.js";
import { FormatedDate } from "../utils/DateFormater.js";
import { socket } from "../socket.js";
import { 
  Clock, User, Phone, Calendar, FileText, Activity, 
  CheckCircle2, Pause, AlertCircle, ChevronRight, X,
  History, Stethoscope, Pill, FileHeart, ArrowLeft, RefreshCw
} from 'lucide-react';

const theme = {
  page: "p-8 bg-slate-50 min-h-screen",
  card: "bg-white border border-slate-200 rounded-2xl shadow-sm",
  cardHover: "bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all",
  h1: "text-[26px] font-extrabold text-slate-900 tracking-tight",
  h2: "text-[20px] font-bold text-slate-900",
  body: "text-[15px] font-medium text-slate-600",
  label: "text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]",
  btnPrimary: "px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm",
  btnSecondary: "px-4 py-2.5 border-2 border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all",
  btnSuccess: "px-4 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-sm",
  btnWarning: "px-4 py-2.5 border-2 border-amber-500 text-amber-700 text-sm font-bold rounded-xl hover:bg-amber-50 transition-all",
  input: "px-4 py-2.5 w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 focus:bg-white outline-none transition-all",
};

const todayVisitsData = async () => {

    try {
      const res = await getAllTodayVisits()
      const visitData = {
        pending: 0,
        inProgress: 0,
        completed: 0,
        patients: res
        
      }
      console.log(visitData);
      return visitData 
    } catch (error) {
      console.error(`Error Getting Todays Patient : ${error.response?.data || error.message}`)
      return error
    }
};

// Mock API - Replace with your actual API calls
// const fetchDoctorQueue = async () => {
//   return {
//     pending: 12,
//     inProgress: 1,
//     completed: 8,
//     patients: [
//       {
//         _id: 1,
//         tokenNo: "A101",
//         fullName: "Noman Ali",
//         age: 35,
//         gender: "Male",
//         phone: "+92 300 1234567",
//         appointmentType: "Consultation",
//         registrationTime: "09:30 AM",
//         status: "pending",
//         priority: "normal",
//         chiefComplaint: "Persistent headache for 3 days",
//         vitals: { bp: "120/80", temp: "98.6°F", pulse: "72 bpm", weight: "75 kg" },
//         previousVisits: [
//           { date: "2024-11-15", diagnosis: "Migraine", medicines: ["Sumatriptan 50mg"] },
//           { date: "2024-10-20", diagnosis: "Common Cold", medicines: ["Paracetamol 500mg"] }
//         ],
//         currentMedications: ["Aspirin 75mg (daily)"],
//         allergies: ["Penicillin"]
//       },
//       {
//         _id: 2,
//         tokenNo: "A102",
//         fullName: "Sarah Ahmed",
//         age: 28,
//         gender: "Female",
//         phone: "+92 301 9876543",
//         appointmentType: "Follow-up",
//         registrationTime: "09:45 AM",
//         status: "pending",
//         priority: "urgent",
//         chiefComplaint: "Follow-up for diabetes management",
//         vitals: { bp: "130/85", temp: "98.4°F", pulse: "78 bpm", weight: "68 kg" },
//         previousVisits: [
//           { date: "2024-11-01", diagnosis: "Type 2 Diabetes", medicines: ["Metformin 500mg"] }
//         ],
//         currentMedications: ["Metformin 500mg (twice daily)"],
//         allergies: []
//       },
//       {
//         _id: 3,
//         tokenNo: "A103",
//         fullName: "Ahmed Hassan",
//         age: 45,
//         gender: "Male",
//         phone: "+92 302 5551234",
//         appointmentType: "New Patient",
//         registrationTime: "10:00 AM",
//         status: "pending",
//         priority: "normal",
//         chiefComplaint: "Chest pain and shortness of breath",
//         vitals: { bp: "140/90", temp: "98.6°F", pulse: "88 bpm", weight: "82 kg" },
//         previousVisits: [],
//         currentMedications: [],
//         allergies: ["Sulfa drugs"]
//       }
//     ]
//   };
// };

export default function DoctorKDSScreen() {
  const [queueData, setQueueData] = useState({ pending: 0, inProgress: 0, completed: 0, patients: [] });
  const [selectedPatient, setSelectedVisit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('queue');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    setIsLoading(true);
    try {
      const data = await todayVisitsData();
      setQueueData(data);
    } catch (error) {
      console.error('Failed to load queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = useCallback((visitId, newStatus) => {

    socket.emit("status-updated", {
      visitId,
      newStatus
    }
  );

    updateVisit( visitId ,{status:newStatus })

    setQueueData(prev => ({
      ...prev,
      patients: prev.patients.map(p => 
        p._id === visitId ? { ...p, status: newStatus } : p
      )
    }));
    
    if (newStatus === 'completed') {
      setQueueData(prev => ({
        ...prev,
        pending: prev.pending - 1,
        completed: prev.completed + 1
      }));
      setTimeout(() => {
        setView('queue');
        setSelectedVisit(null);
      }, 1000);
    }
  }, []);

  const filteredVisits = queueData.patients.filter(v => {
    if (filter === 'pending') return v.status === 'pending';
    if (filter === 'urgent') return v.priority === 'urgent';
    return true;
  });

  if (view === 'detail' && selectedPatient) {
    return <PatientDetailView 
      visit={selectedPatient} 
      onBack={() => { setView('queue'); setSelectedVisit(null); }}
      onStatusUpdate={handleStatusUpdate}
    />;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Loading Overlay - Sticky at top */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-2xl mt-4">
          <div className="mx-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm font-medium text-blue-800">Loading queue...</p>
            </div>
          </div>
        </div>
      )}

      {/* White Container - Like DataTable */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header - Compact */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight leading-none mb-1">Doctor Console</h1>
              <p className="text-[15px] font-medium text-slate-600">Patient Queue Management</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mini Stats - Inline */}
              <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-black text-slate-600">{queueData.pending}</span>
                  <span className="text-xs text-slate-400">Queue</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black text-slate-600">{queueData.inProgress}</span>
                  <span className="text-xs text-slate-400">Active</span>
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs font-black text-slate-600">{queueData.completed}</span>
                  <span className="text-xs text-slate-400">Done</span>
                </div>
              </div>

              <button 
                onClick={loadQueue}
                className="p-2 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs - Compact */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <div className="bg-slate-50 rounded-lg p-1 inline-flex gap-1">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
            <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')}>Pending</FilterButton>
            <FilterButton active={filter === 'urgent'} onClick={() => setFilter('urgent')}>Urgent</FilterButton>
          </div>
        </div>

        {/* Patient Queue Grid - More cards visible */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className={theme.body}>Loading queue...</p>
              </div>
            </div>
          ) : filteredVisits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVisits.map((visit, index) => (
                <PatientCard 
                  key={visit._id} 
                  visit={visit} 
                  index={index}
                  onClick={() => {
                    setSelectedVisit(visit);
                    setView('detail');
                  }}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className={theme.h2 + " mb-2"}>All Clear!</h3>
              <p className={theme.body}>No patients in the queue right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500"
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${colorClasses[color]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl font-black text-slate-900">{value}</span>
      </div>
      <h3 className={theme.label}>{label}</h3>
    </div>
  );
}

// Filter Button - Smaller
function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

// Patient Card Component - Compact
function PatientCard({ visit, index, onClick, onStatusUpdate }) {
  const isPriority = visit.priority === 'urgent';
  
  return (
    <div 
      className={`${isPriority ? 'border-2 border-red-500 bg-red-50' : 'bg-slate-50 border border-slate-100'} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all animate-slideIn`}
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onClick}
    >
      {/* Header - Compact */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-slate-900 text-white text-xs font-black rounded">
              #{visit.tokenNo}
            </span>
            {isPriority && (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-black rounded">!</span>
            )}
          </div>
          <h3 className="text-base font-black text-slate-900 truncate">{visit.patient.fullName}</h3>
          { visit.patient.age && <p className="text-xs text-slate-500">  {visit.patient.age} y {visit.patient.gender} </p> }
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </div>

      {/* Info - Compact */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          <span>{FormatedDate(visit.registrationDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Stethoscope className="w-3 h-3" />
          <span className="truncate">{visit.appointmentType}</span>
        </div>
      </div>

      {/* Actions - Compact */}
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onStatusUpdate(visit._id, 'in-progress'); }}
          className="flex-1 py-1.5 bg-indigo-500 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-all"
        >
          Start
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onStatusUpdate(visit._id, 'hold'); }}
          className="px-2.5 py-1.5 border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-white transition-all"
        >
          <Pause className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Info Row Helper
function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="font-medium text-slate-600">{text}</span>
    </div>
  );
}

// Patient Detail View
function PatientDetailView({ visit, onBack, onStatusUpdate }) {
  const [notes, setNotes] = useState('');

  return (
    <div className={theme.page}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-black rounded-md">
                    #{visit.tokenNo}
                  </span>
                  <h1 className="text-[26px] font-extrabold text-slate-900 tracking-tight">{visit.patient.fullName}</h1>
                </div>
                <p className="text-[15px] font-medium text-slate-600">{visit.patient.age}y  {visit.patient.gender}  {visit.appointmentType}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => onStatusUpdate(visit._id, 'hold')} className={theme.btnWarning}>
                <div className="flex items-center gap-2">
                  <Pause className="w-5 h-5" />
                  Hold
                </div>
              </button>
              <button onClick={() => onStatusUpdate(visit._id, 'completed')} className={theme.btnSuccess}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Complete
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vitals */}
            <div className={`${theme.card} p-6`}>
              <h3 className={theme.h2 + " mb-4 flex items-center gap-2"}>
                <Activity className="w-5 h-5 text-indigo-500" />
                Vitals
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <VitalItem label="Pulse" value={visit.vitals?.pulse} />
                <VitalItem label="Temp" value={visit.vitals?.temp} />
                <VitalItem label="Weight" value={visit.vitals?.weight} />
              </div>
            </div>

            {/* Contact & Allergies */}
            <div className={`${theme.card} p-6`}>
              <h3 className={theme.h2 + " mb-4"}>Contact & Alerts</h3>
              <div className="space-y-3">
                <InfoRow icon={Phone} text={visit.patient.phone} />
                {visit.allergies?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-red-700 mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span className={theme.label + " text-red-700"}>Allergies</span>
                    </div>
                    <p className="text-sm font-bold text-red-900">{visit.allergies.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chief Complaint */}
            <div className="bg-indigo-500 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider mb-2 opacity-90">Chief Complaint</h3>
              <p className="text-xl font-bold">{visit.chiefComplaint}</p>
            </div>

            {/* Previous Visits */}
            <div className={`${theme.card} p-6`}>
              <h3 className={theme.h2 + " mb-4 flex items-center gap-2"}>
                <History className="w-5 h-5 text-indigo-500" />
                Previous Visits
              </h3>
              {visit.previousVisits?.length > 0 ? (
                <div className="space-y-3">
                  {visit.previousVisits?.map((visit, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className={theme.label}>{visit.date}</span>
                        <span className="text-xs font-bold text-indigo-600">{visit.diagnosis}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Pill className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{visit.medicines.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No previous visits</p>
              )}
            </div>

            {/* Clinical Notes */}
            <div className={`${theme.card} p-6`}>
              <h3 className={theme.h2 + " mb-4 flex items-center gap-2"}>
                <FileText className="w-5 h-5 text-indigo-500" />
                Clinical Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter diagnosis, prescriptions, and treatment notes..."
                className={theme.input + " h-40 resize-none"}
              />
              <button className={theme.btnPrimary + " w-full mt-3"}>Save Notes</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// Vital Item
function VitalItem({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className="text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}