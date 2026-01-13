import React, { useState, useEffect, useMemo } from "react";
// import PatientFileModal from "./PatientModal";
import { getAllTodayVisits , createNewVisitAndPatient , createVisit } from "../api/services/visitService.js";
import { getPatientByPhone, updatedPatientDetails } from "../api/services/patientService.js";
import TokenReceipt from "../components/TokenReceiptViewer.jsx";
import { socket } from "../socket.js";
import {
  CalendarDays,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Hash,
  Clock,
  UserPlus,
} from "lucide-react";
import { TextInputField } from "../components/inputFields.jsx";
const env = import.meta.env;

const PatientRegistration = () => {
  const [editPatientId, setEditPatientId] = useState("");
  const [todayVisits, setTodayVisits] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [extraFieldsOpen, setExtraFieldsOpen] = useState(false);

  const patientsPending = todayVisits?.filter((patient) => patient.status === "Pending");
  const patientsInConsultation = todayVisits?.filter((patient) => patient.status === "In Consultation");
  const patientsOnHold = todayVisits?.filter((patient) => patient.status === "Hold");
  const patientsCompleted = todayVisits?.filter((patient) => patient.status === "Completed");

  const [showTokenReceipt, setShowTokenReceipt] = useState({
    isOpen: false,
    receiptData: {},
  });

  const [showMessage, setShowMessage] = useState(null);

  const currentToken = useMemo(() => {
    if (loading) return;
    return (todayVisits?.length + 1).toString().padStart(3, "0");
  }, [todayVisits, loading]);

  const [patientData, setPatientData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [visitData, setVisitData] = useState({
    registrationTime: new Date().toLocaleTimeString(`en-US`, {
      timeStyle: "short",
      hour12: true,
    }),
    registrationDate: new Date().toISOString(),
    status: "Pending",
    appointmentType: "General Consultation",
    priority: "Normal",
  });

  useEffect(() => {
    todayVisitsData();
  }, []);

  socket.on("status-updated", (data) => {
    setTodayVisits((prevPatients) =>
      prevPatients.map((patient) => {
        if (patient._id === data.patientId) {
          return { ...patient, status: data.newStatus };
        }
        return patient;
      })
    );
  });

  // const deleteAll = async () => {
  //   try {
  //     const res = await axios.delete(`${env.VITE_BASE_PATH}/visit/Delete`);
  //   } catch (error) {
  //     console.error(error.response?.data || error.message);
  //   }
  // };

  // const runFunction = async () => {
  //   console.log("Today Patients", todayVisits);
  //   console.log("currently Selected Patient", selectedPatient);
  //   console.log("CcurrentToken", currentToken);
  //   console.log("show token data", showTokenReceipt);
  // };

  const todayVisitsData = async () => {

    try {
      setLoading(true);
      const res = await getAllTodayVisits()

      setTodayVisits(res);
    } catch (error) {
      console.error(`Error Getting Todays Patient : ${error.response?.data || error.message}`)
    } finally {
      setLoading(false);
    }
  };

  const findPatientByPhone = async (phone) => {
    try {

      const res = await getPatientByPhone(phone)
      setSuggestions(res);
    } catch (error) {
      console.error(error.response?.data || error.message);

      setErrors((prev) => ({
        ...prev,
        phone: error.response?.data?.error || error.message,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "age" && value < 0) return;

    if (name === "phone" && value.length >= 4) findPatientByPhone(value);

    if ((name === "phone" && value === "") || value.length < 4) setSuggestions([]);

    const patientDataKeys = Object.keys(patientData);
    const visitDataKeys = Object.keys(visitData);

    if (patientDataKeys.includes(name)) {
      setPatientData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (visitDataKeys.includes(name)) {
      setVisitData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!patientData.fullName?.trim()) newErrors.fullName = "Patient Name is required";

    if (!patientData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const cleanPhone = patientData.phone.replace(/\D/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        newErrors.phone = "Phone number must be between 10-15 digits";
      }
    }

    if (!patientData.email?.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    setErrors(newErrors);  
    
    const isformValid =  Object.keys(newErrors).length === 0;

    if (!isformValid) console.error(newErrors);

    return isformValid

  };

  const populateDataOnPatientEdit = (patient) => {
    setPatientData({
      fullName: patient.fullName || "",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      age: patient.age || "",
      gender: patient.gender || "",
      emergencyContact: patient.emergencyContact || "",
      emergencyPhone: patient.emergencyPhone || "",
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;


    if (editPatientId) {

      const payload = { id:editPatientId , patientData }
      try {
        const updatedPatient = await updatedPatientDetails(payload)
        setShowMessage("Patient Updated Successfully!")

      } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        setShowMessage(null)
      }
    } else {

      try {
        const payload = {
          patientData: { ...patientData },
          visitData: { ...visitData, tokenNo: currentToken }
        };

        const PatientVisit = await createNewVisitAndPatient(payload);

        setShowTokenReceipt({ isOpen: true, receiptData: PatientVisit });
        setTodayVisits((prev) => [...prev, PatientVisit]);
        setShowMessage(`Patient registered successfully with token #${PatientVisit.tokenNo}`);
        setTimeout(() => setShowMessage(null), 3000);


      } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
      }
    }

    setPatientData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      age: "",
      gender: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
  };

  const handleSuggestion = (patient) => {
    const AlreadyGenerated = todayVisits?.some(
      (visit) => visit.patient._id === patient._id
    );

    if (AlreadyGenerated) {
      setShowTokenReceipt({ isOpen: false, receiptData: {} });
      setErrors({ message: "Token Already Generated!" });
    } else {
      (async () => {

        const payload = {visitData: { ...visitData, tokenNo: currentToken } , patientId: patient._id}

        try {
          const newVisit = await createVisit(payload);

          setTodayVisits((prev) => [...prev, newVisit]);
          setShowTokenReceipt({ isOpen: true, receiptData: newVisit });
          setPatientData({phone: ""});
          setShowMessage(`Token# ${currentToken} Successfully Generated!`)
          setTimeout(() => { setShowMessage(null) } , 3000);

        } catch (error) {
          console.error("❌ Error:", error.response?.data || error.message);
        }
      })();
    }

    setSelectedPatient(patient);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Patient Registration
                </h1>
                <p className="text-gray-600">
                  Register new patients and assign appointment tokens
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Next Token Number</div>
              {loading ? (
                <div className="p-3 rounded-lg bg-gray-200 animate-pulse space-y-3"></div>
              ) : (
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-end">
                  <Hash className="h-5 w-5 mr-1" />
                  {currentToken}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="rounded-xl p-4 shadow-sm bg-blue-50 border border-blue-100 flex flex-col justify-between">
            <h3 className="text-3xl font-semibold text-blue-900">
              {todayVisits?.length || "0"}
            </h3>
            <p className="text-sm text-blue-700 mt-2">
              Total Patients Registered
            </p>
          </div>

          <div className="rounded-xl p-4 shadow-sm bg-yellow-50 border border-yellow-100 flex flex-col justify-between">
            <h3 className="text-3xl font-semibold text-yellow-900">{patientsPending?.length || '0'}</h3>
            <p className="text-sm text-yellow-700 mt-2">Patients Waiting</p>
          </div>

          <div className="rounded-xl p-4 shadow-sm bg-purple-50 border border-purple-100 flex flex-col justify-between">
            <h3 className="text-3xl font-semibold text-purple-900">{patientsInConsultation?.length || '0'}</h3>
            <p className="text-sm text-purple-700 mt-2">In Consultation</p>
          </div>

          <div className="rounded-xl p-4 shadow-sm bg-green-50 border border-green-100 flex flex-col justify-between">
            <h3 className="text-3xl font-semibold text-green-900">{patientsCompleted?.length || '0'}</h3>
            <p className="text-sm text-green-700 mt-2">
              Completed / Checked Out
            </p>
          </div>

          <div className="rounded-xl p-4 shadow-sm bg-red-50 border border-red-100 flex flex-col justify-between">
            <h3 className="text-3xl font-semibold text-red-900">{patientsOnHold?.length || '0'}</h3>
            <p className="text-sm text-red-700 mt-2">No-Show / Hold</p>
          </div>
        </div>


        {/* <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow mb-3"
          onClick={deleteAll}
        >
          delete all data
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={runFunction}
        >
          Run Function
        </button> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Patient Information
              </h2>
              {showMessage && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="text-green-800">
                      <strong>Success!</strong> {`${showMessage}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                
                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <TextInputField
                      labelText="Phone Number *"
                      iconName="Phone"
                      type="tel"
                      name="phone"
                      value={patientData.phone}
                      // onBlur={handleBlur}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      errors={
                        errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone}
                          </p>
                        )
                      }
                    />

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 mt-1 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {suggestions.map((patient) => (
                          <li
                            key={patient._id}
                            className="flex justify-between items-center  p-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onMouseDown={() => {
                              handleSuggestion(patient);
                            }}
                          >
                            {patient.fullName} – {patient.phone}
                            <button
                              className="cursor-pointer text-blue-600 font-semibold hover:text-white hover:bg-blue-600 active:bg-blue-700 px-4 py-1.5 rounded-md text-sm transition-colors duration-200 shadow-sm"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setEditPatientId(patient._id);
                                populateDataOnPatientEdit(patient);
                                setSuggestions([]);
                              }}
                            >
                              Edit
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <TextInputField
                    labelText="Email"
                    iconName="Mail"
                    type="email"
                    name="email"
                    value={patientData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    errors={
                      errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )
                    }
                  />
                </div>

                {/* Name + Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputField
                    labelText="Full Name *"
                    iconName="User"
                    type="text"
                    name="fullName"
                    value={patientData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full Name"
                    errors={
                      errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )
                    }
                  />

                  <TextInputField
                    labelText="Age"
                    iconName="CalendarDays"
                    type="number"
                    name="age"
                    value={patientData.age}
                    onChange={handleInputChange}
                    placeholder="Enter Age"
                    errors={
                      errors.age && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.age}
                        </p>
                      )
                    }
                  />
                </div>

                {/* Appointment */}
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Appointment Type
                        </label>
                        <select
                          name="appointmentType"
                          value={patientData.appointmentType}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="General Consultation">
                            General Consultation
                          </option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Health Checkup">Health Checkup</option>
                          <option value="Vaccination">Vaccination</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority
                        </label>
                        <select
                          name="priority"
                          value={patientData.priority}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Emergency">Emergency</option>
                        </select>
                      </div>
                    </div>
                  </div>

                {/* show more fields button */}
                <button
                  type="button"
                  onClick={() => setExtraFieldsOpen(!extraFieldsOpen)}
                  className="mt-3 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <span className="mr-1">
                    {extraFieldsOpen ? "Hide Details" : "More Details"}
                  </span>
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-300 ${extraFieldsOpen ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* hidden fields */}
                <div
                  className={`space-y-6 overflow-hidden transition-all duration-500 ${extraFieldsOpen ? "max-h-[1200px] mt-4" : "max-h-0"
                    }`}
                >
                  {/* Address */}
                  <TextInputField
                    labelText="Address"
                    iconName="MapPin"
                    type="textarea"
                    name="address"
                    value={patientData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                  />

                  {/* Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={patientData.gender}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? "border-red-500" : "border-gray-300"
                          }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInputField
                      labelText="Emergency Contact Name"
                      type="text"
                      name="emergencyContact"
                      value={patientData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="Enter Emergency contact name"
                    />

                    <TextInputField
                      labelText="Emergency Contact Phone"
                      type="tel"
                      name="emergencyPhone"
                      value={patientData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="Enter Emergency Contact Phone"
                    />

                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                className="fixed bottom-5 right-125 shadow-lg cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>
                  {editPatientId
                    ? "Update Patient & Assign Token"
                    : "Register Patient & Assign Token"}
                </span>
              </button>
            </div>
          </div>

          {/* Today's Patients Queue */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white rounded-lg shadow-sm">
            <div className="max-h-[500px]s">
              <div className="flex items-center justify-between mb-4 ">
                <h2 className="text-lg font-semibold text-gray-900">
                  Today's Queue
                </h2>
                <div className="text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {todayVisits?.patient?.length} patients
                </div>
              </div>
            </div>

            {loading ? (
              // Skeleton placeholder
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-gray-100 animate-pulse space-y-3"
                  >
                    {/* Token and Status line */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-10 bg-gray-300 rounded"></div>{" "}
                      {/* token placeholder */}
                      <div className="h-5 w-16 bg-gray-300 rounded-full"></div>{" "}
                      {/* status badge */}
                    </div>

                    {/* Name line */}
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>

                    {/* Appointment + time line */}
                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : todayVisits.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No patients registered today</p>
              </div>
            ) : (
              todayVisits
                ?.slice()
                .reverse()
                .map((visit) => (
                  <div
                    key={visit._id}
                    onClick={() => {
                      setShowTokenReceipt({ isOpen: true, receiptData: visit });
                    }}
                    className={`p-3 border rounded-lg ${visit.priority === "emergency"
                      ? "border-red-200 bg-red-50"
                      : visit?.priority === "urgent"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-gray-200 bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">
                        #{visit?.tokenNo.slice(-3)} 
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${visit.priority === "emergency"
                          ? "bg-red-100 text-red-800"
                          : visit?.priority === "urgent"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {visit?.status}
                      </div>
                    </div>
                      <div className="text-sm text-gray-700">
                        {visit.patient?.fullName} 
                      </div>

                  <div className="flex justify-between">
                    <div className="text-xs text-gray-500 mt-1">
                      {visit?.appointmentType} • {new Date(visit?.registrationDate).toLocaleTimeString(`un-PK`, {
                        timeStyle: "short",
                        hour12: true,
                      })}
                    </div>
                      <div className="text-sm text-gray-700">
                        {visit.patient?.phone} 
                      </div>
                    </div>
                  </div>
                ))
            )}
            <TokenReceipt
              isOpen={showTokenReceipt.isOpen}
              onClose={() => setShowTokenReceipt(false)}
              errors={errors}
              setErrors={setErrors}
              receiptData={{
                ...showTokenReceipt.receiptData,
                estimatedTime: "",
                department: "",
                doctor: "",
                notes: "",
                instructions: "",
              }}
            />
            {/* <PatientFileModal isOpen={showTokenReceipt} patient={selectedPatient} onClose={() => { setSelectedPatient(null), setShowTokenReceipt(false) }} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
