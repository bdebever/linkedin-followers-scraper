# LinkedIn Followers Extractor

This tool is a simple JS script that fetches the followers of a LinkedIn company page.

This script is a version 0 - it can be improved. I just wanted to extract my page's followers. Then, I've plugged the result to Phantombuster in order to scrape and enrich the profiles.

_How to use_

1. Run `npm install` to install all packages
2. Create a .env file to set up your environment variables
3. Fill in those values:
- ORGA_ID (you can get it by going to your LinkedIn admin section, eg. this URL `https://www.linkedin.com/company/{ID}/admin/analytics/followers/` )
- TOTAL_PAGE_FOLLOWERS
- CSRF token & cookie which you get by inspecting the request LinkedIn does (Network tab)

![Image](https://share.getcloudapp.com/4gujqmG5)