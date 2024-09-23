require("dotenv").config();
const express = require("express");
const router = require("./routers");
const app = express();
const port = process.env.PORT || 4444;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send('sosmed service running well')
})
app.use(router)

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
