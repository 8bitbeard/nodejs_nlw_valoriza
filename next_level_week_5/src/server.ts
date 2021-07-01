import { http } from "./http";
import "./websocket/client";

let portNumber = 3000

http.listen(portNumber, () => console.log(`Server is running on port ${portNumber}`));
