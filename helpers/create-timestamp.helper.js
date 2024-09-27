function createTimeStamp() {
    const timeStamp = Math.floor(new Date().getTime() / 1000)

    console.log(timeStamp, "isi time stamp")

    return timeStamp
}

module.exports = createTimeStamp