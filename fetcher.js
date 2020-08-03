'use strict';

require('dotenv').config();
const request = require('request-promise-native');
const fs = require('fs');
const fastcsv = require('fast-csv');
const ws = fs.createWriteStream('followers.csv');
const ROOT_URL = 'https://www.linkedin.com/voyager/api/voyagerOrganizationDashFollowers?decorationId=com.linkedin.voyager.dash.deco.organization.FullFollowers-1&q=organization';

const BATCH = 100;

// Complete those variables into an .env file
const { TOTAL_PAGE_FOLLOWERS, ORGA_ID, COOKIES, CSRF_TOKEN } = process.env;

const sleep = (s) => new Promise(resolve => setTimeout(resolve, s*1000));

const main = async (organizationId, total) => {

    let results = [];
    let moreFollowers = true;
    let index = 0;

    while (moreFollowers) {

        console.log(index);
        let currentIndex = index * BATCH;

        let { data: { paging }, included } = await callApi(organizationId, currentIndex)

        console.log(`Got ${included.length} profiles`)

        // Improve data part
        results = [...results, ...included.filter(item => item.firstName).map(item => ({
        	profileUrl: formatProfileUrl(item.entityUrn),
        	firstName: item.firstName || '',
        	lastName: item.lastName || '',
        	headline: item.headline || ''
        }))];

        console.log(`We currently have ${results.length} profiles collected`)

        moreFollowers = (paging && paging.total >= currentIndex)

        // Random number between 2 and 8
        await sleep((Math.floor(Math.random() * 7)) + 2);
        index++;

    }

    console.log(`Finished collecting ${results.length} followers`)

    return results;

};

const formatProfileUrl = (url) => url.replace('urn:li:fsd_profile:', 'https://linkedin.com/in/');

const callApi = async (organizationId, start) => {

	console.log(start);

    const options = {
        method: 'GET',
        uri: `${ROOT_URL}&organization=urn%3Ali%3Afsd_company%3A${organizationId}&start=${start}&count=${BATCH}`,
        headers: {
            'authority': 'www.linkedin.com',
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
            'csrf-token': CSRF_TOKEN,
            'sec-fetch-site': 'same-origin',
            'cookie': COOKIES

        },
        json: true
    };


    let results={};
    try {
        results = await request(options);
        //console.log(results)
    } catch (error) {
        console.log(error);
    }

    return results;
}

const saveToCsv = (data) => {
	fastcsv
	  .write(data, { headers: true })
	  .pipe(ws);
}


main(ORGA_ID, TOTAL_PAGE_FOLLOWERS)
    .then(value => {
        const data = saveToCsv(value);
    })
    .catch(e => console.log(`error: ${e}`))