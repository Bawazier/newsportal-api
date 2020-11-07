const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("morgan");

const app = express();
const {APP_PORT} =  process.env;

app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Backend is running well"
    });
});

app.listen(APP_PORT, () => {
    console.log(`app listen on port ${APP_PORT}`);
});

const auth = require("./routes/auth");

// attach member router
app.use("/auth", auth);