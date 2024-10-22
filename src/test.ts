import { api, dtDate, dtfind, getdt, login } from "./api/api";
import { dtDataInit } from "./dtData/getList";
import * as fs from 'fs';

let token = '';


dtDataInit(0)
    .then(data => {
        fs.writeFileSync('log.json', JSON.stringify(data))
    })