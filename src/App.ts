import * as express from 'express';
import * as request from 'request-promise';
import * as cheerio from 'cheerio';
import * as cron from 'node-cron';
import * as fs from 'fs';
import * as cors from 'cors';
import * as morgan from 'morgan';
var config = require('../config-scraper.json');

class App {
  public express;
  public cors;
  vessels: any[];
  vessel: any;
  page: number;
  schedule: String;
  logs: String;
  pages: number;

  constructor() {
    this.express = express();
    this.cors = cors();
    this.page = 1;
    this.vessels = JSON.parse(fs.readFileSync('./data/vessels.json', 'utf8'));
    this.logs = fs.readFileSync('./logs.txt', 'utf8');
    this.schedule = `${config.minutes} ${config.hour} ${config.dayOfMonth} ${config.month} ${config.dayOfWeek}`;
    this.pages = config.pages;
    cron.schedule(this.schedule, () => {
      console.log("Scraping...")
      this.scrape();
    });
    this.mountRoutes();

  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get('/', (req, res) => {
      res.send("Scrapy");
    });
    this.express.use('/', router);
  }

  private scrape(): void {
    for (let page = 1; page <= this.pages; page++) {
      request({
        uri: `https://www.myshiptracking.com/search/vessels?page=${page}`,
        transform: (body, req) => {
          this.logs += ` Request => URL: ${req.request.uri.href} - Method: ${req.req.method} -  Status code: ${req.statusCode} - Date and time of request: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}, \n`;
          console.log(this.logs);
          fs.writeFileSync('./logs.txt', this.logs);
          return cheerio.load(body);
        }
      })
        .then(($) => {
          console.log("Scraper started");
          $('.table_main tbody tr').each((i, elem) => {
            console.log("Scraping data from webpage...");
            this.vessel = {
              "timestamp": new Date(),
              "name": $(elem).children('td').children('span').children('a').text(),
              "type": $(elem).children('td').children('.small11').text(),
              "MMSI": $(elem).children('td:nth-child(3)').text(),
              "IMO": $(elem).children('td:nth-child(4)').text(),
              "size": $(elem).children('td:nth-child(5)').text(),
              "location": $(elem).children('td').children('.area_txt_2lines').text(),
              "destination": $(elem).children('td').children('.small').text()
            }
            this.vessels.push(this.vessel);
          });
          console.log("Scraper ended");
          fs.writeFileSync('./data/vessels.json', JSON.stringify(this.vessels, null, 2));

        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}


export default new App().express
