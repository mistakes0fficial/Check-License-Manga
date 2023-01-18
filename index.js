const express = require('express');
const request = require('request-promise');
const app = express();
const apiKey = 'your_api_key';

app.get('/manga', (req, res) => {
    const mangaName = req.query.name;
    const options = {
        uri: `https://kitsu.io/api/edge/manga?filter[text]=${mangaName}`,
        headers: {
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${apiKey}`
        }
    };
    request(options)
        .then(data => {
            const mangaData = JSON.parse(data).data[0].attributes;
            const { title, synopsis, status, startDate, endDate, chapterCount, isLicensed } = mangaData;
            let licensedMessage = "";
            if (isLicensed) {
                licensedMessage = "This manga is licensed and not available for reading.";
            } else {
                licensedMessage = "This manga is not licensed and available for reading.";
            }
            res.send(`
              <h1>${title}</h1>
              <img src="${mangaData.posterImage.small}">
              <p>Status: ${status}</p>
              <p>Start Date: ${startDate}</p>
              <p>End Date: ${endDate}</p>
              <p>Latest chapter: ${chapterCount}</p>
              <p>Synopsis: ${synopsis}</p>
              <p>${licensedMessage}</p>
            `);
        })
        .catch(err => {
            res.send(`An error occurred: ${err}`);
        });
});
