const fs = require("fs");
const puppeteer = require("puppeteer");
const global_response = require("../../response/global.response");
const queryFindUser = require("../../helpers/query-find-user.helper");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const openBrowser = require("../../helpers/open-browser.helper");

const commentJson = JSON.parse(fs.readFileSync("./json/comment.json"));

async function processTask(user, link) {
  let browser
  try {
    const puppeteerLink = await openBrowser(user.user_id);

    if (puppeteerLink.user_id) {
      await storeData(
        puppeteerLink.message,
        puppeteerLink.user_id,
        userStatus.failed,
        userStatus.inactive
      );
      return;
    }

    browser = await puppeteer.connect({
      browserWSEndpoint: puppeteerLink,
      defaultViewport: null,
    });

    const pages = await browser.pages();
    const page = pages.length > 1 ? await browser.newPage() : pages[0];

    for (let i = 1; i < pages.length; i++) {
      await pages[i].close();
    }

    await page.goto(link, { waitUntil: "networkidle2" });

    setTimeout(async () => {
      try {
        await page.click('span[data-e2e="comment-icon"]')

        const comment_text_box = await page.waitForSelector('div[data-e2e="comment-text"]', { visible: true });

        if (!comment_text_box) {
          const error_message = `account tiktok ${user.user_id} : ERROR NETWORK OR PROXY `
          throw (error_message)
        }

        const randomIndex = Math.floor(
          Math.random() * commentJson.comments.length
        );

        await page.type('div[data-e2e="comment-text"]', commentJson.comments[randomIndex]);
        await page.keyboard.press("Enter");

        await storeData("-", user.user_id, userStatus.success, userStatus.active);
        console.log(`${user.user_id} success comment`);

        setTimeout(async () => {
          await browser.close()
        }, 5000);

      } catch (error) {
        console.log(error)
        await browser.close()
      }
    }, 10000);

  } catch (userError) {
    console.error(`Error processing user ${user.user_id}:`, userError);
    await storeData(
      "Failed to process user",
      user.user_id,
      userStatus.failed,
      userStatus.inactive
    );
    //await browser.close()
  }
}


async function processQueue(users, link) {
  for (const user of users) {
    await processTask(user, link);
  }
}

async function comment_tiktok(req, res) {
  try {
    const { link, active } = req.body;
    const findUsers = await queryFindUser(active);

    await processQueue(findUsers, link);

    res
      .status(200)
      .json(global_response("SUCCESS", 200, { message: "All users processed" }));
  } catch (error) {
    console.error("Main error:", error);
    res.status(500).json(global_response("FAILED", 500, error.toString()));
  }
}

module.exports = comment_tiktok 
