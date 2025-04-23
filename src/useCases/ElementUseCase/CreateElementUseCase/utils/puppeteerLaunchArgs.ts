import { LaunchOptions } from "puppeteer";

export const puppeteerLaunchArgs: LaunchOptions = {
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote",
    "--single-process",
    "--proxy-server='direct://'",
    "--proxy-bypass-list=*",
    "--deterministic-fetch",
  ],
  dumpio: true,
};
