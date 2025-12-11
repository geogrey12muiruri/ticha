/**
 * Kenya Ministry of Education Scholarship Scraper
 * Scrapes scholarship data from education.go.ke/scholarships
 */
import type { Scholarship } from '../types';
interface ScrapeOptions {
    limit?: number;
    type?: 'scholarship' | 'bursary' | 'grant' | 'all';
}
export declare class KenyaScholarshipScraper {
    private readonly BASE_URL;
    private readonly SCHOLARSHIPS_URL;
    /**
     * Fetch scholarships from Ministry of Education website
     */
    fetchScholarships(options?: ScrapeOptions): Promise<Partial<Scholarship>[]>;
    /**
     * Map scraped type to our Scholarship type
     */
    private mapType;
    /**
     * Parse deadline string to ISO date
     */
    private parseDeadline;
}
export {};
//# sourceMappingURL=ministry-of-education.d.ts.map