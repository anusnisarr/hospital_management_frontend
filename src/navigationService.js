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
