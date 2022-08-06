const puppeteer = require('puppeteer');

const testLogin = async () => {
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.goto('http://localhost:8080/#/login');
  await page.screenshot({ path: './loginBlank.png', fullPage: true });
  await page.waitForSelector('input[name=email]'); 
  //await page.$eval('input[name=email]', el => el.value = 'abel@mit.edu');
  await page.$eval('input[name=email]', (el) => {
    el.value = 'abel@mit.edu';
    const event = new Event('change');
    el.dispatchEvent(event);
  }, 'abel@mit.edu');
  //await page.$eval('input[name=password]', el => el.value = 'mysecret');
  await page.$eval('input[name=password]', (el) => {
    el.value = 'mysecret';
    const event = new Event('change');
    el.dispatchEvent(event);
  }, 'mysecret');
  await page.screenshot({ path: './loginParams.png', fullPage: true });
  await page.click('#frmSubmit');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: './loginSuccess.png', fullPage: true });
  await browser.close();
};

module.exports = testLogin;