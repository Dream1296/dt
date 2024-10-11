import { api, dtDate, dtfind, getdt, login } from "./api/api";
import { dtDataInit } from "./dtData/getList";
import * as fs from 'fs';

let token = '811ee89fb17ef9357e7bfe81c758d01a54f73e74eeb187f6aa7377b3b6a74d709cb58465df538bc50874af68ab2ea2bb';


dtDataInit(0, token)
    .then(data => {
        fs.writeFileSync('log.json', JSON.stringify(data))
    })