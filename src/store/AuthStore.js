let accessToken = null
let user = null
let authStatus = "unknown";


export const AuthStore = {

    setAccessToken(token){
        accessToken = token;
        authStatus = "authenticated";
    },

    getAccessToken() {
        return accessToken;
    },

    getAuthStatus() {
        return authStatus;
    },
    
    clearAccessToken() {
        accessToken = null;
    },

    markUnauthenticated() {
        accessToken = null;
        authStatus = "unauthenticated";
    },

    setUser(userData){
        user = userData;
    },
    
    getUser() {
        return user;
    },
    
    clearUser() {
        user = null;
    }

};