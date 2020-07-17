'use strict';

const request = require('request-promise-native');
const fs = require('fs');
const fastcsv = require('fast-csv');
const ws = fs.createWriteStream('followers.csv');
const ROOT_URL = 'https://www.linkedin.com/voyager/api/voyagerOrganizationDashFollowers?decorationId=com.linkedin.voyager.dash.deco.organization.FullFollowers-1&q=organization';

const COUNT_FOLLOWERS = 100;

// Complete those variables
const TOTAL_PAGE_FOLLOWERS=1000;
const ORGA_ID = '';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async (organizationId, total) => {

    let results = [];

    for (let index = 0; index <= parseInt(total/COUNT_FOLLOWERS); index++) {

    	console.log(index);

        let { data, included } = await callApi(organizationId, index * COUNT_FOLLOWERS);

        // Improve data part
        results = [...results, ...included.filter(item=>item.firstName).map(item => ({
        	profileUrl: formatProfileUrl(item.entityUrn),
        	firstName: item.firstName || '',
        	lastName: item.lastName || '',
        	headline: item.headline || ''
        }))];

        sleep(5000);

    }

    return results;

};

const formatProfileUrl = (url) => url.replace('urn:li:fsd_profile:', 'https://linkedin.com/in/');

const callApi = async (organizationId, start) => {

	console.log(start);

    const options = {
        method: 'GET',
        uri: `${ROOT_URL}&organization=urn%3Ali%3Afsd_company%3A${organizationId}&start=${start}&count=${COUNT_FOLLOWERS}`,
        headers: {
            'authority': 'www.linkedin.com',
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
            'csrf-token': '',
            'sec-fetch-site': 'same-origin',
            'cookie': ''

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