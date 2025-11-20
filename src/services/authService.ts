import http from "./http";

export async function loginService(dni: string, contrasena: string) {
  const res = await http.post("/auth/login/", { dni, contrasena });
  return res.data;
}

export async function meService() {
  const res = await http.get("/auth/me/");
  return res.data;
}
