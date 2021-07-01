import { http } from "./http";
import "./websocket/client";
import "./websocket/admin"

let portNumber = 3000

http.listen(portNumber, () => console.log(`Server is running on port ${portNumber}`));
