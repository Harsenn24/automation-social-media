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

        const findUsers = await queryFindUser()

        const commentJson = JSON.parse(fs.readFileSync("./json/comment.json"))

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

                const element_comment = 'div[data-e2e="comment-text"]'

                setTimeout(async()=> {
                    const textComment = await page.waitForSelector(element_comment, { timeout: 20000 });
    
                    if (textComment) {
    
                        await page.click(element_comment)
    
                        const randomIndex = Math.floor(Math.random() * commentJson.comments.length);
    
                        await page.type(
                            element_comment,
                            commentJson.comments[randomIndex]
                        );
    
                        await page.keyboard.press("Enter");
    
                        await storeData("-", user.user_id, userStatus.success, userStatus.active);
                    } else {
                        await browser.close()
                        throw new Error("Video element not found");
                    }
                }, 15000)


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

module.exports = comment_tiktok;
