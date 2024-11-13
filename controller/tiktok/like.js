const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const queryFindUser = require("../../helpers/query-find-user.helper");

async function like_tiktok(req, res) {
  try {
    const { link, active } = req.body;

    const findUsers = await queryFindUser(active);

    for (const user of findUsers) {
      let browser
      try {
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

        browser = await puppeteer.connect({
          browserWSEndpoint: puppeteerLink,
          defaultViewport: null,
        });

        const pages = await browser.pages();

        let page

        if (pages.length > 1) {
          for (let i = 1; i < pages.length; i++) {
            await pages[i].close()
          }
          page = await browser.newPage();
        } else {
          page = await browser.newPage();;
        }

        await page.goto(link);

        let successProcess = false

        while (!successProcess) {
          try {
            const videoElement = await page.waitForSelector("video", { timeout: 10000 });

            if (videoElement) {
              const elementToClick = await page.$("video");

              await elementToClick.click();
              await elementToClick.click();

              await storeData("-", user.user_id, userStatus.success, userStatus.active);
              successProcess = true
              console.log(`${user.user_id} success like`)
            } else {
              successProcess = true
              throw new Error("Video element not found");
            }

          } catch (likeError) {
            successProcess = true
            await storeData("Failed to like", user.user_id, userStatus.failed, userStatus.inactive);
          } finally {
            setTimeout(async () => {
              await browser.close();
            }, 3000)
          }
        }

      } catch (error) {
        await browser.close()
        await storeData("Failed to like", user.user_id, userStatus.failed, userStatus.inactive);
        console.error(`Error for user ${user.user_id}:`, error);
      }

    }

    res.status(200).json(global_response("SUCCESS", 200, { message: "sukses" }));
  } catch (error) {
    console.log("Main error:", error);
    res.status(400).json(global_response("FAILED", 400, error.toString()));
  }
}

module.exports = like_tiktok;
