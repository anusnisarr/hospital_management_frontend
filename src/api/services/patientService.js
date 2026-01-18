import API from "../intercepator";

export const getPatient = async (search ,  page , pageSize , columnFields, sort ) => {

    const params = { search, page, pageSize, columnFields };

    if (sort?.field) {
        params.sortField = sort.field;
        params.sortDirection = sort.direction;
    }

    const res = await API.get("/patient", { params } );    
    return res.data
    
}

export const getPatientByPhone = async ( phone ) => {

    const res = await API.get(`/patient/search?phone=${phone}`);    
    return res.data
    
}

export const updatePatientDetails = async ( payload ) => {

    const res = await API.patch(`/patient/update/${payload.id}` ,  {patientData : payload.patientData} );
    return res.data
    
}


export const getPatientWithHistory = async (patientId) => {

    const response = await API.get(`/patient/${patientId}/history`);
    return {
      patient: response.data.data,
      success: true
    };
};