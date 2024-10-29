const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const queryFindUser = require("../../helpers/query-find-user.helper");

async function view_tiktok(req, res) {
  try {
    const { link } = req.body;

    const findUsers = await queryFindUser()

    for (const user of findUsers) {
      const puppeteerLink = await openBrowser(user.user_id);

      if (puppeteerLink.user_id) {
        await storeData(
          puppeteerLink.message,
          puppeteerLink.user_id,
          userStatus.failed,
          userStatus.inactive
        );
        res
          .status(400)
          .json(global_response("FAILED", 400, puppeteerLink.message));
      }

      const browser = await puppeteer.connect({
        browserWSEndpoint: puppeteerLink,
        defaultViewport: false,
      });

      const pages = await browser.pages(0);

      const page = pages[0];

      page.goto(link);

      setTimeout(async () => {
        await page.reload();

        const videoElement = await page.waitForSelector("video", { timeout: 10000 });

        if (videoElement) {
          const elementToClick = await page.$("video");

          await elementToClick.click(); 


          setTimeout(async () => {
            await elementToClick.click(); 
          }, 10000)


          setTimeout(async () => {
            await elementToClick.click(); 
          }, 10000)


          setTimeout(async () => {
            await elementToClick.click(); 
          }, 10000)

          await storeData("-", user.user_id, userStatus.success, userStatus.active);
        } else {
          await browser.close()
          throw new Error("Video element not found");
        }

        setTimeout(async () => {
          await browser.close()
        }, 30000)

      }, 10000);

      await storeData("-", user.user_id, userStatus.success, userStatus.active);
    }

    res
      .status(200)
      .json(global_response("SUCCESS", 200, { message: "sukses" }));
  } catch (error) {
    res.status(400).json(global_response("FAILED", 400, error.toString()));
  }
}

module.exports = view_tiktok;
