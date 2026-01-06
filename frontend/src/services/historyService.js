import baseApi from "./apiService";

export const getHistory = async () => {
    return await baseApi.get("/reports/history");
}


