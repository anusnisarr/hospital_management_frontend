
export const FormatedDate = (date) => {

    const registrationDate = new Date(date).toLocaleString("ur-PK" , {hour12:true})
    return registrationDate
}