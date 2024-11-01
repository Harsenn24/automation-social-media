const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const queryFindUser = require("../../helpers/query-find-user.helper");
const fs = require('fs');

async function comment_tiktok(req, res) {
    try {
        const { link } = req.body;
        const findUsers = await queryFindUser();
        const commentJson = JSON.parse(fs.readFileSync("./json/comment.json"));

        for (const user of findUsers) {
            try {
                const puppeteerLink = await openBrowser(user.user_id);

                if (puppeteerLink.user_id) {
                    await storeData(
                        puppeteerLink.message,
                        puppeteerLink.user_id,
                        userStatus.failed,
                        userStatus.inactive
                    );
                    continue;
                }

                const browser = await puppeteer.connect({
                    browserWSEndpoint: puppeteerLink,
                    defaultViewport: false,
                });

                const pages = await browser.pages();
                const page = pages[0] || await browser.newPage();

                await page.goto(link, { timeout: 60000 });

                const MAX_RETRIES = 3;
                // let retries = 0;
                let successProcess = false;

                while (!successProcess) {
                    try {
                        await page.reload();

                        const element_comment = 'div[data-e2e="comment-text"]';
                        const textComment = await page.waitForSelector(element_comment, { visible: true });

                        if (textComment) {
                            await textComment.click();
                            const randomIndex = Math.floor(Math.random() * commentJson.comments.length);
                            await page.type(element_comment, commentJson.comments[randomIndex]);
                            await page.keyboard.press("Enter");

                            await storeData("-", user.user_id, userStatus.success, userStatus.active);
                            successProcess = true;
                            console.log(`${user.user_id} success comment`)
                        } else {
                            throw new Error("Comment element not found");
                        }
                    } catch (commentError) {
                        successProcess = true
                        await storeData("Failed to comment", user.user_id, userStatus.failed, userStatus.inactive);
                    }

                }

                setTimeout(async () => {
                    await browser.close();
                }, 5000)

            } catch (userError) {
                console.error(`Error for user ${user.user_id}:`, userError);
            }
        }

        res.status(200).json(global_response("SUCCESS", 200, { message: "All users processed" }));
    } catch (error) {
        console.log("Main error:", error);
        res.status(500).json(global_response("FAILED", 500, error.toString()));
    }
}


module.exports = comment_tiktok;
