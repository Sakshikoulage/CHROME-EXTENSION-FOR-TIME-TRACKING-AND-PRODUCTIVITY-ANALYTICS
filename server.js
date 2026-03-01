const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));

mongoose.connect("mongodb://127.0.0.1:27017/productivity");

const TimeSchema = new mongoose.Schema({
    website: String,
    timeSpent: Number,
    category: String,
    date: Date
});

const Time = mongoose.model("Time", TimeSchema);
const productive = [
    "github.com",
    "leetcode.com",
    "stackoverflow.com"
];

const unproductive = [
    "instagram.com",
    "youtube.com",
    "facebook.com"
];

function classifySite(site) {

    if (productive.some(p => site.includes(p))) {
        return "Productive";
    }

    if (unproductive.some(u => site.includes(u))) {
        return "Unproductive";
    }

    return "Neutral";
}
app.post("/track", async (req, res) => {

    const category = classifySite(req.body.website);

    const data = new Time({
        website: req.body.website,
        timeSpent: req.body.timeSpent,
        category: category,
        date: new Date()
    });

    await data.save();
    res.send("Saved");
});

app.get("/analytics", async (req, res) => {
    const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const data = await Time.find({
    date: { $gte: oneWeekAgo }
});
    res.json(data);
});
app.get("/score", async (req, res) => {

    const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const data = await Time.find({
    date: { $gte: oneWeekAgo }
});

    let productiveTime = 0;
    let totalTime = 0;

    data.forEach(entry => {
        totalTime += entry.timeSpent;

        if (entry.category === "Productive") {
            productiveTime += entry.timeSpent;
        }
    });

    let score = 0;

    if (totalTime > 0) {
        score = (productiveTime / totalTime) * 100;
    }

    res.json({
        productivityScore: score.toFixed(2)
    });
});
app.get("/analytics-data", async (req, res) => {

    const data = await Time.find();

    let productiveTime = 0;
    let unproductiveTime = 0;
    let neutralTime = 0;

    data.forEach(entry => {

        if (entry.category === "Productive") {
            productiveTime += entry.timeSpent;
        }

        else if (entry.category === "Unproductive") {
            unproductiveTime += entry.timeSpent;
        }

        else {
            neutralTime += entry.timeSpent;
        }
    });

    res.json({
        productiveTime,
        unproductiveTime,
        neutralTime
    });
});
app.get("/daily-breakdown", async (req, res) => {

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const data = await Time.find({
        date: { $gte: oneWeekAgo }
    });

    let days = {
        Sun: { productive: 0, total: 0 },
        Mon: { productive: 0, total: 0 },
        Tue: { productive: 0, total: 0 },
        Wed: { productive: 0, total: 0 },
        Thu: { productive: 0, total: 0 },
        Fri: { productive: 0, total: 0 },
        Sat: { productive: 0, total: 0 }
    };

    data.forEach(entry => {

        const day = new Date(entry.date)
            .toLocaleDateString("en-US", { weekday: "short" });

        days[day].total += entry.timeSpent;

        if (entry.category === "Productive") {
            days[day].productive += entry.timeSpent;
        }
    });

    let result = {};

    for (let d in days) {
        if (days[d].total > 0) {
            result[d] =
                (days[d].productive / days[d].total) * 100;
        } else {
            result[d] = 0;
        }
    }

    res.json(result);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});