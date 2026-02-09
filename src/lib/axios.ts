import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    if (!config.url?.includes("/api/auth")) {
      const token = localStorage.getItem("crm_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message || "Unknown error";
      const userDetailsRaw = localStorage.getItem("userDetails");
      const userDetails = userDetailsRaw ? JSON.parse(userDetailsRaw) : null;

      switch (status) {
        case 400: {
          const data = error.response.data;

          // 1️⃣ Direct message (most login errors)
          if (typeof data?.message === "string") {
            toast.error(data.message);
            break;
          }

          // 2️⃣ Array of errors
          if (Array.isArray(data)) {
            data.forEach((msg) => toast.error(String(msg)));
            break;
          }

          // 3️⃣ Field-based validation errors
          if (typeof data === "object" && data !== null) {
            Object.values(data).forEach((value) => {
              if (Array.isArray(value)) {
                value.forEach((msg) => toast.error(String(msg)));
              } else if (typeof value === "string") {
                toast.error(value);
              }
            });
            break;
          }

          toast.error("Bad request");
          break;
        }

        case 401:
          await axios.post(`/api/logout/`);
          localStorage.removeItem("crm_token");
          localStorage.removeItem("userDetails");
          location.reload();
          // Swal.fire({
          //   title: userDetails.email,
          //   input: "password",
          //   text: "Your session has expired. Please login again to access this page.",
          //   inputAttributes: {
          //     autocapitalize: "off",

          //   },
          //   imageUrl: "/images/user/jigme.jpg",
          //   imageWidth: 100,
          //   imageHeight: 100,
          //   imageAlt: "User profile",
          //   customClass: {
          //     image: "rounded-full",
          //     input: "flex h-9 w-80 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          //     confirmButton: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          //     cancelButton: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          //   },
          //   showCancelButton: true,
          //   confirmButtonText: "Login",
          //   confirmButtonColor: "#000",
          //   // cancelButtonText: "Logout",
          //   cancelButtonColor: "#EF4444",
          //   showLoaderOnConfirm: true,
          //   allowOutsideClick: false,
          //   preConfirm: async (password) => {
          //     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
          //       {
          //         email: userDetails.email,
          //         password: password,
          //       },
          //     ).then((response) => {
          //       const { message, data } = response.data;
          //       toast.success(message, {
          //         position: "top-right",
          //         autoClose: 1500,
          //       });
          //       const token = data.access;
          //       document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 1}; samesite=Lax;`;
          //       localStorage.setItem("token", token);
          //       setTimeout(()=>{
          //         location.reload();
          //       }, 1500)
          //     }).catch((error) => {
          //       toast.error(error.message || "An error occurred during login.", {
          //         position: "top-right",
          //         autoClose: 3000,
          //       });
          //     });
          //   }
          // }).then(async (result) => {
          //   if (result.dismiss === Swal.DismissReason.cancel) {
          //     await axios.post(`/api/logout/`);
          //     localStorage.removeItem("token");
          //     localStorage.removeItem("userDetails");
          //     location.reload();
          //   }
          // });

          break;

        case 403:
          console.error("Forbidden:", message);
          toast.info('You don’t have permission to access this resource.');
          break;

        case 404:
          console.error("Not Found:", message);
          toast.error('Requested resource not found.');
          break;

        case 500:
          console.error("Server Error:", message);
          toast.error('Something went wrong on the server. Please try again later.');
          break;

        default:
          console.error("API Error:", message);
          // toast.error(`Error: ${message}`);
          break;
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Timeout Error:", error.message);
      toast.error('Request timed out. Please try again.');
    } else if (error.message.includes("Network Error")) {
      console.error("Network Error:", error.message);
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else if (error.code === "ERR_CONNECTION_REFUSED") {
      console.error("Connection Refused:", error.message);
      toast.error('Failed to connect to the server. Please try again later.');
    } else {
      console.error("Unexpected Error:", error.message);
      toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

export default api;
