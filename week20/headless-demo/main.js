const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://localhost:8080/main.html');
  // 获取 a 标签
  const  a = await page.$("a");
  console.log(a.asElement().boxModel());
 
  // 获取图片
  const imgs = await page.$$("a");
  console.log(imgs);

})();