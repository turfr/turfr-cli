#!/usr/bin/env node

import {route} from "./router.js";

const ASCII_ART = `
 _               __
| |_ _   _ _ __ / _|_ __ TM
| __| | | | '__| |_| '__|
| |_| |_| | |  |  _| |
 \\__|\\__,_|_|  |_| |_|
`;

console.log(ASCII_ART);
console.log("turfr CLI v1.0");
console.log("Created by Swar Kunwar");

// console.log(process.argv.slice(2));
await route(process.argv.slice(2));
