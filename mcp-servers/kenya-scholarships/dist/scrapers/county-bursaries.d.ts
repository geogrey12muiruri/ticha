/**
 * County Bursary Scraper
 * Scrapes county-specific bursary programs from various county portals
 */
import type { Scholarship } from '../types';
export declare class CountyBursaryScraper {
    private readonly COUNTY_PORTALS;
    /**
     * Fetch bursaries for a specific county
     */
    fetchBursaries(county: string): Promise<Partial<Scholarship>[]>;
    private parseDeadline;
}
//# sourceMappingURL=county-bursaries.d.ts.map