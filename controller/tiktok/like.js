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
      try {
        const puppeteerLink = await openBrowser(user.user_id);

        if (puppeteerLink.user_id) {
          await storeData(
            puppeteerLink.message,
            user.user_id,
            userStatus.failed,
            userStatus.inactive
          );
          
        }

        const browser = await puppeteer.connect({
          browserWSEndpoint: puppeteerLink,
          defaultViewport: null,
        });

        const pages = await browser.pages();

        let page;

        if (pages.length > 1) {
          for (let i = 1; i < pages.length; i++) {
            await pages[i].close();
          }
          page = await browser.newPage();
        } else {
          page = await browser.newPage();
        }

        await page.goto(link, { waitUntil: "networkidle2", timeout: 60000 });

        setTimeout(async () => {
          try {
            await page.reload()
            const videoElement = await page.waitForSelector("video", { timeout: 10000 });
  
            if (videoElement) {
              const elementToClick = await page.$("video");
  
              await elementToClick.click();
              await elementToClick.click();
  
              await storeData("-", user.user_id, userStatus.success, userStatus.active);
              console.log(`${user.user_id} success like`)
            } else {
              console.log("error akun :" , user.user_id)
            }
  
            setTimeout(async() => {
              await browser.close()
            }, 5000);
            
          } catch (error) {
            console.log(error, "error line 102")
            await browser.close()
          }

        }, 10000);

      } catch (error) {
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
