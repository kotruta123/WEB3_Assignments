import http from "../http-common";

class UnoDataService {
    getAll(){
        return http.get("/uno");
    }
}