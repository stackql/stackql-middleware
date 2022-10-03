import {
    bold,
    cyan,
    green,
    yellow,
  } from "https://deno.land/std@0.152.0/fmt/colors.ts";

function getDateTime(){
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

const info = (message: string) => {
    console.log(`${bold(green(getDateTime()))} ${bold(green('INFO'))} ${bold(message)}`);
};

const error = (message: string) => {
    console.log(`${bold(cyan(getDateTime()))} ${bold(cyan('ERROR'))} ${bold(message)}`);
};

const debug = (message: string) => {
    console.log(`${bold(yellow(getDateTime()))} ${bold(yellow('DEBUG'))} ${bold(message)}`);
};

export {
    info,
    error,
    debug,
}