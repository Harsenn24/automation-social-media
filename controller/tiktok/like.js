const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const queryFindUser = require("../../helpers/query-find-user.helper");

async function like_tiktok(req, res) {
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
        try {
          await page.reload();
        } catch (error) {
          await storeData(
            "error refresh tiktok like",
            user.user_id,
            userStatus.failed,
            userStatus.inactive
          );
          await browser.close();
        }

        let elementToClick;

        try {
          elementToClick = await page.waitForSelector("video");
        } catch (error) {
          await storeData(
            "error wait selector",
            user.user_id,
            userStatus.failed,
            userStatus.inactive
          );
          await browser.close();
        }

        if (elementToClick) {
          try {
            const videoElement = await page.$("video");

            try {
              setTimeout(async () => {
                await videoElement.click();
                await videoElement.click();
              }, 10000);
              
            } catch (error) {
              await storeData(
                "error double click",
                user.user_id,
                userStatus.failed,
                userStatus.inactive
              );
              await browser.close();
            }


            setTimeout(async () => {
              await browser.close();
            }, 20000);
          } catch (error) {
            await storeData(
              "error waiting video css",
              user.user_id,
              userStatus.failed,
              userStatus.inactive
            );
            await browser.close();
          }
        }
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

module.exports = like_tiktok;
