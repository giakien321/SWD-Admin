export function storeTokens({ accessToken, refreshToken }) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
}

export function getAccessToken() {
  return typeof window === "undefined" ? null : localStorage.getItem("accessToken");
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

export function decodeJwt(token) {
  if (!token) return null;
  try {
    const b = token.split('.')[1];
    return JSON.parse(atob(b));
  } catch {
    return null;
  }
}
