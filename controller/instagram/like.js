const sequelize = require("../../config");
const { QueryTypes } = require("sequelize");
const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");

async function like_instagram_worker(req, res) {
  try {

    const { link } = req.body

    const findUsers = await sequelize.query(`
      select u.user_id from users u
      `, {
      type: QueryTypes.SELECT
    })


    for (const user of findUsers) {
      const puppeteerLink = await openBrowser(user.user_id)

      const browser = await puppeteer.connect({ browserWSEndpoint: puppeteerLink, defaultViewport : false })

      const pages = await browser.pages(0)

      const page = pages[0]

      page.goto(link)

      setTimeout(async () => {
        const viewBoxValue = await page.$eval('svg.x1lliihq.x1n2onr6.xxk16z8', svg => svg.getAttribute('viewBox'));
        
        if(viewBoxValue === "0 0 24 24") {
          console.log(true)
        } else {
          console.log(false)
        }
      }, 8000);
    }


    res.status(200).json(global_response("SUCCESS", 200, { message: "sukses" }));

  } catch (error) {
    console.log(error)
    res.status(400).json(global_response("FAILED", 400, error.toString()));
  }
}

module.exports = like_instagram_worker;
