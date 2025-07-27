
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRoles");
  window.location.href = "/";
};