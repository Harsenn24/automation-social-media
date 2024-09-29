function createTimeStamp() {
    const timeStamp = Math.floor(new Date().getTime() / 1000)

    return timeStamp
}

module.exports = createTimeStamp