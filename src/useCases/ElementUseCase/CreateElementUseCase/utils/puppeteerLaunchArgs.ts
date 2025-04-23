import { LaunchOptions } from "puppeteer-core";

export const puppeteerLaunchArgs: LaunchOptions = {
  headless: true,
  executablePath: process.env.BROWSER_EXECUTABLE_PATH,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  dumpio: true,
};
