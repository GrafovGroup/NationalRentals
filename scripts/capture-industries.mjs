import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH});
const page = await browser.newPage();
await mkdir("docs/qa",{recursive:true});
const errors = [];
page.on("pageerror",e=>errors.push(e.message));
for (const [name,path,width,height] of [
  ["industries-en-desktop","/en/industries/",1440,1000],
  ["industry-construction-en-desktop","/en/industries/construction-infrastructure/",1440,1000],
  ["industry-healthcare-fr-mobile","/fr/secteurs/sante-etablissements/",390,844],
]) {
  await page.setViewportSize({width,height});
  await page.goto("http://127.0.0.1:3000"+path);
  await page.screenshot({path:`docs/qa/${name}.jpg`,quality:85});
}
console.log(JSON.stringify({pageErrors:errors}));
await browser.close();
if(errors.length) process.exitCode=1;
