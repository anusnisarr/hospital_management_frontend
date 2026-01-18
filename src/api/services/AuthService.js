import authAPI from "../authApiInstance";
import { resetApiSession } from "../authApiInstance";
import { AuthStore } from "../../store/AuthStore";
import { navigateToLogin } from "../../navigation/navigationService";

export const getNewAccessToken = async () => {

    const res = await authAPI.post(`/auth/refresh`);
    return res.data

};

export const logout = async (reason = "USER_ACTION") => {
  
  try {
    await authAPI.post("/auth/logout");
  } catch (_) {
  } finally {
    resetApiSession();
    AuthStore.clearAccessToken();
    AuthStore.clearUser();
    navigateToLogin();
    console.log("Logged out due to:", reason);
  }

};
