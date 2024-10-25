const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const queryFindUser = require("../../helpers/query-find-user.helper");

async function like_tiktok(req, res) {
  try {
    const { link } = req.body;

    const findUsers = await queryFindUser();

    for (const user of findUsers) {
      const puppeteerLink = await openBrowser(user.user_id);

      if (puppeteerLink.user_id) {
        await storeData(
          puppeteerLink.message,
          user.user_id,
          userStatus.failed,
          userStatus.inactive
        );
        return res
          .status(400)
          .json(global_response("FAILED", 400, puppeteerLink.message));
      }

      const browser = await puppeteer.connect({
        browserWSEndpoint: puppeteerLink,
        defaultViewport: null,
      });

      try {
        const [page] = await browser.pages();

        await page.goto(link, { waitUntil: 'networkidle2' });

        await page.reload();

        const videoElement = await page.waitForSelector("video", { timeout: 10000 });

        if (videoElement) {
          const elementToClick = await page.$("video");

          await elementToClick.click(); 
          await elementToClick.click(); 

          await storeData("-", user.user_id, userStatus.success, userStatus.active);
        } else {
          throw new Error("Video element not found");
        }

      } catch (error) {
        await storeData(
          error.message || "Error during TikTok like",
          user.user_id,
          userStatus.failed,
          userStatus.inactive
        );
      } finally {
        setTimeout(async () => {
            await browser.close();
        }, 6000);
      }
    }

    res.status(200).json(global_response("SUCCESS", 200, { message: "sukses" }));
  } catch (error) {
    res.status(400).json(global_response("FAILED", 400, error.toString()));
  }
}

module.exports = like_tiktok;
