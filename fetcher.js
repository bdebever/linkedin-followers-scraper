'use strict';

const request = require('request-promise-native');
const fs = require('fs');
const fastcsv = require('fast-csv');
const ws = fs.createWriteStream('followers.csv');
const ROOT_URL = 'https://www.linkedin.com/voyager/api/voyagerOrganizationDashFollowers?decorationId=com.linkedin.voyager.dash.deco.organization.FullFollowers-1&q=organization';

const COUNT = 100;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const main = async (organizationId = 26360686, total = 100) => {

    let results = [];

    for (let index = 0; index <= parseInt(total/COUNT); index++) {

    	console.log(index);

        let { data, included } = await callApi(organizationId, index * COUNT);

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
        uri: `${ROOT_URL}&organization=urn%3Ali%3Afsd_company%3A${organizationId}&start=${start}&count=${COUNT}`,
        headers: {
            'authority': 'www.linkedin.com',
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
            'csrf-token': 'ajax:5318906222539089916',
            'sec-fetch-site': 'same-origin',
            //'referer': 'https://www.linkedin.com/company/26360686/admin/analytics/followers/?anchor=org-view-followers',
            'cookie': 'lissc=1; bcookie="v=2&a9a0de26-b43d-46f5-89cd-9fce37b42965"; bscookie="v=1&202006080740123c713d58-5d73-4488-8552-f61569be01e1AQH1y5wwB-zGlx6FADEGHsSSlxL2FJEl"; li_rm=AQEMwILIwlbVawAAAXKS37eKWyFiT4nk5OZHBQS14uZ5yzlC3YI2UdedbE-58vwoj2656FG3m9PHmChB-B3aKlxpxbVihygTf6YJOpP8SQWdt4lTXdsRN2bz; AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg=1; spectroscopyId=9745ae07-1895-4116-a4aa-a6cee0a45e6b; PLAY_LANG=en; _guid=8553c4cb-319d-4751-8b69-c35204d547c3; JSESSIONID="ajax:5318906222539089916"; visit="v=1&G"; fid=AQFD3fNiE1D_FgAAAXM3O3BoiTzQAZYbp7jVpOJIR6YWTV8B-belP-NrJBMNRgsG8ko4pdY88qIIiA; fid=AQFQy0Ro2-yzXwAAAXNIyCRTlDX46YIPSBqK2V_g1FrQOpLNNgohYh_qfLb4VYvA4EXdlKigx-chEg; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiIwZTYyN2IzNi1mMjQwLTQzNTQtODk4YS02Mjg2NjQ5NjU5ODR8MTU5MTcwMzYxNCIsInJlY2VudGx5LXNlYXJjaGVkIjoiIiwicmVmZXJyYWwtdXJsIjoiIiwiYWlkIjoiIiwiUk5ULWlkIjoifDAiLCJyZWNlbnRseS12aWV3ZWQiOiI2Njg0NCIsIkNQVC1pZCI6Ik56SmhZams0WTJNdFltTTFNaTAwWVRNeExXSTNOemN0TVdJMFpHWTJNV016TlRRMiIsImZsb3dUcmFja2luZ0lkIjoiK3VSWlk5amVRektIWDgwSjM5RWliUT09IiwiZXhwZXJpZW5jZSI6ImVudGl0eSIsImlzX25hdGl2ZSI6ImZhbHNlIiwid2hpdGVsaXN0Ijoie30iLCJ0cmsiOiIifSwibmJmIjoxNTk0NzE5NzgxLCJpYXQiOjE1OTQ3MTk3ODF9.RBxDTLQrIDgkwpieM4sBYkMdJ6fyXoZKTk-dkInuT2U; liap=true; li_at=AQEDARl7r-MCx9VZAAABc0y07oUAAAFzcMFyhU0AkBIKkCbMHjYNsM1JyAzfpvEkDQutFoFwZooOGUKmj8cCk896gY6I9Gm4hk2fGuF9NirlsPLmvJk8y4kto7QA_KSDCsD1soFniLCYUa7v0wXR4Mfd; lang=v=2&lang=en-us; UserMatchHistory=AQIbsCrC0NdRswAAAXNRPZSUqEn8uikH9h1o43cMMlolZ8QSgEhUz_ayDfLHa4pNOhpsUdpdPXxizNX2Z4W6LBtmOi7Z9X1y1khpDQvREUv86A; li_oatml=AQE5ct7AtTBG-AAAAXNRPZaUpvlGeR6HFcSa6JMuEpKmA4NCU-AL5U9uHaENgWm_HWtyQX2pEZe8KBxyFY3DxTs-Wx4xLJHu; sdsc=22%3A1%2C1594799357377%7ECONN%2C0OsQE%2FywvoQ4Rb44rHAU7IkYcRio%3D; AMCV_14215E3D5995C57C0A495C55%40AdobeOrg=-408604571%7CMCIDTS%7C18458%7CMCMID%7C10872657495497466037986550219350317091%7CMCOPTOUT-1594808422s%7CNONE%7CvVersion%7C4.6.0; UserMatchHistory=AQJI5A_Nic9VvQAAAXNRj_-Y0x-Md84j4lnos4wSo61Vzawxbw1lUygPTyy-O23Mi6iMLPRExoYB9_PB-YHLzArGUMopEPjUG6ScAHY9NZtyo-3YPNxOPdNrw9hNo0fydhHhj8mA3lPVUIl4SHYI29bSx8OssKmKe3oDqkZtGFKBOG8YvviHZTtYGyRNr5kyI62x_EgJp9DClJ2QPZkKBUfY0panhaJqx2ugIno_xcvY9jzyxrkybZnejXZQ46Gutyb0V8M; lidc="b=VB55:s=V:r=V:g=2824:u=11:i=1594801260:t=1594822054:v=1:sig=AQHbixqLXeKfssV33jrC-06UJi_lDKAj'

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


main()
    .then(value => {
        const data = saveToCsv(value);
    })
    .catch(e => console.log(`error: ${e}`))