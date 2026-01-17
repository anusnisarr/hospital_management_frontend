import authAPI from "../authApiInstance";

export const getNewAccessToken = async () => {

    const res = await authAPI.post(`/auth/refresh`);
    return res.data

};