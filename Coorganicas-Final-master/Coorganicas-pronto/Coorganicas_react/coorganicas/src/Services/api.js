import Axios from 'axios';
const api = Axios.create({
    //publishdeixar só localrost
    //npm run biuld
    //netcoreapp.3.0 dotnet publish
    

    baseURL:"http://localhost:5000/api",
    headers:{
        "Content-Type" : "application/json",
        "Authorization" : "Bearer " + localStorage.getItem("user-coorganicas")
    }
});

export default api;