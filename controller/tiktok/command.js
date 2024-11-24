const global_response = require("../../response/global.response");
const openBrowser = require("../../helpers/open-browser.helper");
const puppeteer = require("puppeteer");
const storeData = require("../../helpers/store-data-success-error.helper");
const userStatus = require("../../enums/user-status.enum");
const queryFindUser = require("../../helpers/query-find-user.helper");
const fs = require('fs');

async function command_tiktok(req, res) {
    try {
        const { link, active } = req.body;
        const findUsers = await queryFindUser(active);
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

                let page

                if (pages.length > 1) {
                    for (let i = 1; i < pages.length; i++) {
                        await pages[i].close()
                    }
                    page = await browser.newPage();
                } else {
                    page = await browser.newPage();;
                }

                await page.goto(link, { waitUntil: "networkidle2" , timeout: 60000});
                let successProcess = false;

                while (!successProcess) {
                    try {

                        await page.keyboard.press("PageDown", { delay: 3000 })

                        const element_comment = 'div[data-e2e="comment-text"]';
                        const textComment = await page.waitForSelector(element_comment, { waitUntil: "networkidle2", timeout: 60000 });

                        if (textComment) {
                            const randomIndex = Math.floor(Math.random() * commentJson.comments.length);
                            await page.type(element_comment, commentJson.comments[randomIndex]);
                            await page.keyboard.press("Enter");

                            await storeData("-", user.user_id, userStatus.success, userStatus.active);
                            successProcess = true;
                            console.log(`${user.user_id} success comment`)
                        } else {
                            successProcess = true;
                            throw new Error("Comment element not found");
                        }
                    } catch (commentError) {
                        successProcess = true
                        await storeData("Failed to comment", user.user_id, userStatus.failed, userStatus.inactive);
                    } finally {
                        setTimeout(async () => {
                            await browser.close();
                        }, 5000)

                    }
                }

            } catch (userError) {
                await storeData("Failed to comment", user.user_id, userStatus.failed, userStatus.inactive);
                console.error(`Error for user ${user.user_id}:`, userError);
            }
        }

        res.status(200).json(global_response("SUCCESS", 200, { message: "All users processed" }));
    } catch (error) {
        console.log("Main error:", error);
        res.status(500).json(global_response("FAILED", 500, error.toString()));
    }
}


module.exports = command_tiktok;
