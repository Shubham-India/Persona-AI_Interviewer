import baseApi from "./apiService";

// *login*




// *register*
export const registerUser = async (userData)=>{
    return await baseApi.post("/auth/register", userData);
}



// *currentUser*
export const fetchCurrentUser = async ()=>{
    return await baseApi.get("/auth/me");
}


// *LogOut*
export const logoutUser = async ()=>{
    localStorage.removeItem("token");
    return await baseApi.post("/auth/logout");
}

