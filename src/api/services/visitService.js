import API from "../intercepator";

export const getVisits = async (search , page , pageSize , columnFields, sort ) => {

    const params = { search, page, pageSize, columnFields };

    if (sort?.field) {
        params.sortField = sort.field;
        params.sortDirection = sort.direction;
    }

    const res = await API.get("/visit", { params });    
    return res.data
 
}

export const getTodayVisits = async () => {

    const res = await API.get("/visit/todayVisits");    
    return res.data
 
}

export const createNewVisitAndPatient = async (payload) => {

    const res = await API.post("/visit/registerPatientAndVisit" , payload );    
    return res.data
 
}

export const createVisit = async (payload) => {

    const res = await API.post("/visit/newVisit" , payload );    
    return res.data
 
}