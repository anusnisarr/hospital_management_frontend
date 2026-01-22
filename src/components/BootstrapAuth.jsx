import { getNewAccessToken } from "../api/services/AuthService";
import { AuthStore } from "../store/AuthStore";

const BootstrapAuth = async () => {
  try {
    const res = await getNewAccessToken();
    AuthStore.setAccessToken(res.accessToken);
    AuthStore.setUser(res.user);
  } catch (err) {
    AuthStore.markUnauthenticated();
  }
};

export default BootstrapAuth;
