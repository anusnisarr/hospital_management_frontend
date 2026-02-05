let navigateFn;

export const setNavigate = (navigate) => {
  navigateFn = navigate;
};

export const navigateToLogin = () => {
  if (navigateFn) {
    navigateFn("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};

export const navigateToRegister = () => {
  if (navigateFn) {
    navigateFn("/register", { replace: true });
  } else {
    window.location.href = "/register";
  }
};
