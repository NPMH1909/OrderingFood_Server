import express from "express"

const CheckRouter = express.Router()
CheckRouter.get("/", (req, res) => {
    res.status(200).send("Healthy");
});

export default CheckRouter