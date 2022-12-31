import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { question } from "readline-sync";
import delay from "delay";
import chalk from "chalk";

console.log(
  chalk.yellow(`
+++++++++++++++++++++++++++++++++++++++++++
+ Auto Login http://sim.sunan-giri.ac.id  +
+ Auto Scrapping Bidata Mahasiswa         +
+ Author: https://github.com/risqikhoirul +
+++++++++++++++++++++++++++++++++++++++++++
`)
);

let user = question("Masukan NIM: ");
let pass = question("Masukan Password: ", { hideEchoBack: true });

console.log(chalk.yellow("Sedang Membuka Browser..."));
await delay(1000);
console.log(chalk.yellow("Sedang Membuka http://sim.sunan-giri.ac.id/front/gate/index.php"));
(async () => {
  const browser = await puppeteer.launch({
    //headless: false
  });
  const page = await browser.newPage();
  await page.goto("http://sim.sunan-giri.ac.id/front/gate/index.php");

  await page.focus("input");
  const inputUser = "input[name=txtUserID]";

  await page.waitForSelector(inputUser);
  await page.type(inputUser, user);
  await page.keyboard.press("Tab");

  const inputPw = "input[name=txtPassword]";
  await delay(500);
  await page.waitForSelector(inputPw);
  await page.type(inputPw, pass);
  await delay(500);
  await page.keyboard.press("Enter");
  console.log(chalk.yellow(`Sedang Login...`));
  await delay(1000);
  const html = await page.content();
  const $ = cheerio.load(html);
  const checkLogin = $(".unitname").text();
  // await console.log(checkLogin);

  if (checkLogin === "Prodi S1 Teknik Informatika") {
    console.log(chalk.green("Login Berhasil"));
    console.log();
    const spanElement = await page.$(".unitname");
    await spanElement.click();
    await delay(2000);
    await page.goto("http://sim.sunan-giri.ac.id/siakad/siakad/index.php?page=data_mahasiswa&self=1");
    const biodata = await page.content();
    const $ = cheerio.load(biodata);
    const biodataOut = $("#show").text();
    console.log(biodataOut);
    console.log();
    console.log(chalk.green("Berhasil Scrapping Data"));
    await delay(500);

    console.log(chalk.green("Sedang menutup browser..."));
    await delay(1000);
    await browser.close();
    console.log(chalk.green("Menutup browser berhasil"));
  } else {
    console.log(chalk.red("Gagal Login!"));
    console.log(chalk.red("NIM dan Password Salah"));
    browser.close();
  }
})();
