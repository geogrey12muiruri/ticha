/**
 * NG-CDF (National Government Constituency Development Fund) Bursary Scraper
 * Scrapes NG-CDF bursary information
 */
import type { Scholarship } from '../types';
interface NGCDBOptions {
    county?: string;
    constituency?: string;
}
export declare class NGCDBScraper {
    private readonly BASE_URL;
    /**
     * Fetch NG-CDF bursaries
     */
    fetchBursaries(options?: NGCDBOptions): Promise<Partial<Scholarship>[]>;
    private parseDeadline;
}
export {};
//# sourceMappingURL=ngcdf.d.ts.map