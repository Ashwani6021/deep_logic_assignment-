const axios = require("axios");
const cheerio = require("cheerio");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use('/',postRoutes);

app.get("/", getTimeStories);

app.listen(5000, () => console.log("Server running on port 5000"));

// mongoose.set('useFindAndModify', false);
async function getTimeStories(req, res) {
  try {
    // Send a GET request to Time.com
    const response = await axios.get("https://time.com");
    // console.log(response);
    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Select the elements containing the latest stories
    const latestStories = $(".latest-stories__item");
    console.log(latestStories);
    // Initialize an array to store the extracted information
    const storiesArray = [];

    // Extract information from each story element
    latestStories.each((index, element) => {
      if (index < 6) {
        // Limit to the latest 6 stories
        const title = $(element).find("a").text().trim();
        const path = $(element).find("a").attr("href");
        const origin = "https://time.com";
        const url = origin + path;

        // Create an object for each story and push it to the array
        storiesArray.push({ title, url });
      }
    });

    // Return the array of latest stories as a JSON object
    res.send({ latestStories: storiesArray });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.send({ message: "error occured while scraping" });
  }
}
