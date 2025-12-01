import axios from "axios";

export const USE_FAKE_BACKEND = true;

export const api = axios.create({
  baseURL: USE_FAKE_BACKEND ? "/" : "https://your-real-backend.com",
  timeout: 5000,
  withCredentials: true,
});

let ACCESS_TOKEN: string | null = null;
let ACCESS_EXPIRES_AT: number | null = null;

export const saveAccessToken = (token: string, expires: number) => {
  ACCESS_TOKEN = token;
  ACCESS_EXPIRES_AT = expires;

  sessionStorage.setItem("access_token", token);
  sessionStorage.setItem("access_expires", String(expires));
};

export const getAccessToken = () => ACCESS_TOKEN;

api.interceptors.request.use((config) => {
  const token = ACCESS_TOKEN || sessionStorage.getItem("access_token");
  const exp = Number(
    ACCESS_EXPIRES_AT || sessionStorage.getItem("access_expires")
  );

  if (exp && Date.now() > exp) return config;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (exp && Date.now() < exp) {
    const newExp = Date.now() + 15 + 60 + 1000;
    ACCESS_EXPIRES_AT = newExp;
    sessionStorage.setItem("access_expires", String(newExp));
  }
  return config;
});

api.interceptors.request.use(async (config) => {
  if (!USE_FAKE_BACKEND) return config;
  if (config.url === "/login" && config.method === "post") {
    await new Promise((res) => setTimeout(res, 700));

    const { email, password } = config.data;

    const validUser = {
      email: "admin@test.com",
      password: "123456",
      id: 1,
      name: "Admin User",
      role: "admin",
    };

    if (email === validUser.email && password === validUser.password) {
      const accessExp = Date.now() + 5 * 60 * 1000; // 5 min
      const refreshExp = Date.now() + 24 * 60 * 60 * 1000; // 24h
      throw {
        isFakeSuccess: true,
        fakeResponse: {
          data: {
            accessToken: "fake-access-" + Date.now(),
            refreshToken: "fake-refresh-" + Date.now(),
            expiresAt: accessExp,
            refreshExpiresAt: refreshExp,
            user: validUser,
          },
          status: 200,
          config,
        },
      };
    }

    // wrong credentials
    throw {
      isFakeError: true,
      fakeError: {
        response: {
          status: 401,
          data: { message: "Invalid email or password" },
        },
      },
    };
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;
    if (
      !USE_FAKE_BACKEND &&
      error.response?.status === 401 &&
      !original._retry
    ) {
      original._retry = true;
      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;
        const newExpiry = Date.now() + 15 * 60 * 1000;

        saveAccessToken(newToken, newExpiry);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }
    if (error.isFakeSuccess) {
      return Promise.resolve(error.fakeResponse);
    }

    // fake login fail
    if (error.isFakeError) {
      return Promise.reject(error.fakeError);
    }
    return Promise.reject(error);
  }
);
