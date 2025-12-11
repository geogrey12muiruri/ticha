/**
 * NG-CDF (National Government Constituency Development Fund) Bursary Scraper
 * Scrapes NG-CDF bursary information
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
export class NGCDBScraper {
    BASE_URL = 'https://ngcdf.go.ke'; // Adjust to actual NG-CDF portal URL
    /**
     * Fetch NG-CDF bursaries
     */
    async fetchBursaries(options = {}) {
        try {
            // Note: Actual URL structure may vary
            // This is a template implementation
            const url = options.county
                ? `${this.BASE_URL}/bursaries/${options.county.toLowerCase()}`
                : `${this.BASE_URL}/bursaries`;
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                timeout: 30000,
            });
            const $ = cheerio.load(response.data);
            const bursaries = [];
            // Parse bursary listings (adjust selector based on actual HTML)
            $('.bursary-item, .scholarship-card, table tbody tr').each((index, element) => {
                const $item = $(element);
                const name = $item.find('.title, h3, td:first-child').text().trim();
                const amount = $item.find('.amount, .value').text().trim();
                const deadline = $item.find('.deadline, .date').text().trim();
                const description = $item.find('.description, p').text().trim();
                if (!name)
                    return; // Skip if no name
                const bursary = {
                    name: name || 'NG-CDF Bursary',
                    provider: 'NG-CDF',
                    type: 'bursary',
                    description: description || 'NG-CDF Constituency Bursary',
                    amount: amount || undefined,
                    applicationDeadline: this.parseDeadline(deadline),
                    eligibility: {
                        counties: options.county ? [options.county] : [],
                        constituencies: options.constituency
                            ? [options.constituency]
                            : [],
                    },
                    contactInfo: {
                        source: 'NG-CDF',
                        website: this.BASE_URL,
                    },
                };
                bursaries.push(bursary);
            });
            return bursaries;
        }
        catch (error) {
            console.error('Error scraping NG-CDF bursaries:', error.message);
            return [];
        }
    }
    parseDeadline(deadlineStr) {
        if (!deadlineStr)
            return undefined;
        const date = new Date(deadlineStr);
        if (!isNaN(date.getTime())) {
            return date.toISOString();
        }
        return undefined;
    }
}
//# sourceMappingURL=ngcdf.js.map