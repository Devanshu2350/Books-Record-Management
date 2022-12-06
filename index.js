const express = require("express");

const app = express();

const PORT = 8081;

app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({
        message: "server is up and running",
    });
});

app.get("*", (req,res) => {
    res.status(200).json({
        message: "This route does not exits",
    });
});

app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`);
});
