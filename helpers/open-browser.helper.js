const URL_ADSPOWER = process.env.URL_ADSPOWER;
const axios = require("axios");

async function openBrowser(user_id) {
    try {
        const { data } = await axios.get(`${URL_ADSPOWER}${user_id}`);

        if (data.msg !== "success") throw (
            {
                message: data.msg,
                user_id
            }
        )

        if (data.code === -1) {
            throw new Error(data.msg)
        }


        const puppeteerLink = data.data.ws.puppeteer

        return puppeteerLink
    } catch (error) {
        return error
    }

}

module.exports = openBrowser