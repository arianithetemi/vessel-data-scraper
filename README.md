# Vessel Data Scraper

Vessel Data Scraper is an NodeJS application that will scrape real-time data from [this website](https://www.myshiptracking.com/). The data will be scraped in a specific schedule with cron that is customizable. The scraper can scrape data from a specified number of pages. After data is scraped, it will be saved on a file inside data directory, as JSON format. The HTTP polling information will be saved in a file called **logs.txt**.

**Note:** This scraper app is not finished completely. There will be added also the front-end side and API in order to make it easier to change the settings and see the HTTP polling, and other information through a web interface. Unit tests will be added too.

## Settings for scheduler
Please follow the guideline below in order to set your desired configuration for scheduling the scraper.

By default the app wil scrape two pages, for every minute.

The configuration file is: **config-scraper.json**
```
{
	"minutes": "*", 
	"hour": "*",
	"dayOfMonth": "*",
	"month": "*",
	"dayOfWeek": "*",
	"pages": 2
}
```
The * value means for every minute, hour, dayOfMonth and so on.

Please feel free to change them explained the possible settings as below.
```
minutes (0 - 59)
hour (0 - 23)
dayOfMonth (1 - 31)
month (1 - 12)
dayOfWeek (0 - 6) (Sunday=0)
pages (1 - 26509)
```

## Technologies used:
 * Server-side scripting: **JavaScript**
 * Javascript Superset: **TypeScript**
 * Back-end Framework: **ExpressJS**
 * Time-based job scheduler: **Node Cron**

## Setup Development Environment

1. Open terminal

2. Clone the project in your local machine:
```
git clone git@github.com:arianithetemi/vessel-data-scraper.git
cd vessel-data-scraper
```
3. Install all modules used in app:
```
npm install
```
4. Build and run the scraper app
```bash
npm run-script build
npm run dev
```

### Running tests

```bash
npm test
```

### Building a container

```bash
docker build .
```

### Author: Arianit Hetemi
