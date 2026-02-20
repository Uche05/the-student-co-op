/**
 * ============================================
 * Job Scraper Module
 * ============================================
 * Specialized scraper for extracting real job postings
 * from major job boards with working apply links.
 * 
 * Primary: JSearch API (RapidAPI) - Reliable job listings
 * Fallback: Direct scraping of job sites
 */

import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';

// ============================================
// Types
// ============================================

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
  source: string;
  postedDate?: string;
}

// ============================================
// JSearch API Integration (Primary Source)
// ============================================

/**
 * Fetch jobs from JSearch API (RapidAPI)
 * This provides real job listings with verified apply URLs
 */
async function fetchJobsFromJSearch(query: string): Promise<Job[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  
  // If no API key, return empty array to fall back to other sources
  if (!apiKey) {
    console.log('[JSearch] No API key found');
    return [];
  }

  try {
    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params: {
        query: `${query} UK`,
        num_results: 20,
        page: 1,
        country: 'gb',
        language: 'en',
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    });

    const jobs = response.data.data?.map((job: any, index: number) => ({
      id: `jsearch-${Date.now()}-${index}`,
      title: job.job_title || 'Job Position',
      company: job.employer_name || 'Company',
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : (job.job_country || 'UK'),
      salary: job.job_salary_currency && job.job_salary_period 
        ? `${job.job_salary_currency} ${job.job_salary_period}` 
        : undefined,
      description: job.job_description?.substring(0, 500) || '',
      url: job.job_apply_link || '',
      source: job.job_publisher || 'JSearch',
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
    })) || [];

    console.log(`[JSearch] Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[JSearch] API error:', axiosError.message);
    return [];
  }
}

// ============================================
// Jooble API Integration (Alternative)
// ============================================

/**
 * Fetch jobs from Jooble API
 * Free job search API specifically for UK jobs
 */
async function fetchJobsFromJooble(query: string): Promise<Job[]> {
  const apiKey = process.env.JOOBLE_API_KEY;
  
  if (!apiKey) {
    console.log('[Jooble] No API key found');
    return [];
  }

  try {
    const response = await axios.post('https://jooble.org/api/', {
      keywords: query,
      location: 'United Kingdom',
      page: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      timeout: 15000,
    });

    const jobs = response.data.jobs?.slice(0, 20).map((job: any, index: number) => ({
      id: `jooble-${Date.now()}-${index}`,
      title: job.title || 'Job Position',
      company: job.company || 'Company',
      location: job.location || 'UK',
      salary: job.salary || undefined,
      description: job.snippet?.substring(0, 500) || '',
      url: job.link || '',
      source: 'Jooble UK',
      postedDate: job.pubDate || new Date().toISOString(),
    })) || [];

    console.log(`[Jooble] Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[Jooble] API error:', axiosError.message, axiosError.response?.status);
    return [];
  }
}

// ============================================
// Adzuna API Integration (Alternative Free UK Jobs)
// ============================================

/**
 * Fetch jobs from Adzuna API
 * Free job search API for UK jobs
 */
async function fetchJobsFromAdzuna(query: string): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  
  if (!appId || !appKey) {
    console.log('[Adzuna] No API credentials found');
    return [];
  }

  try {
    const response = await axios.get('https://api.adzuna.com/v1/api/jobs/gb/search/1', {
      params: {
        app_id: appId,
        app_key: appKey,
        what: query,
        where: 'United Kingdom',
        results_per_page: 20,
      },
      timeout: 15000,
    });

    const jobs = response.data.results?.map((job: any, index: number) => ({
      id: `adzuna-${Date.now()}-${index}`,
      title: job.title || 'Job Position',
      company: job.company?.display_name || 'Company',
      location: job.location?.display_name || 'UK',
      salary: job.salary_min && job.salary_max 
        ? `£${job.salary_min} - £${job.salary_max}` 
        : (job.salary_is_predicted ? 'Competitive' : undefined),
      description: job.description?.substring(0, 500) || '',
      url: job.redirect_url || '',
      source: 'Adzuna UK',
      postedDate: job.created || new Date().toISOString(),
    })) || [];

    console.log(`[Adzuna] Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('[Adzuna] API error:', axiosError.message, axiosError.response?.status);
    return [];
  }
}

interface SiteConfig {
  name: string;
  baseUrl: string;
  searchUrl: string;
  selectors: {
    jobList: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    applyUrl: string;
    date: string;
  };
  searchParams: (query: string, page: number) => Record<string, string>;
  transform: ($: any, element: any) => Partial<Job> | null;
}

// ============================================
// Scraper Client Setup
// ============================================

const createScraperClient = () => {
  return axios.create({
    timeout: 30000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
  });
};

const scraperClient = createScraperClient();

// ============================================
// Site Configurations
// ============================================

const siteConfigs: SiteConfig[] = [
  {
    name: 'Indeed UK',
    baseUrl: 'https://www.indeed.co.uk',
    searchUrl: 'https://www.indeed.co.uk/jobs',
    selectors: {
      jobList: '.jobsearch-ResultsList > li',
      title: '.jobTitle',
      company: '.companyName',
      location: '.companyLocation',
      salary: '.salaryText',
      description: '.job-snippet',
      applyUrl: '.jobTitleLink, a[data-jk]',
      date: '.date',
    },
    searchParams: (query, page) => ({
      q: query,
      l: 'United Kingdom',
      start: String(page * 10),
    }),
    transform: ($, element) => {
      const $el = $(element);
      const title = $el.find('.jobTitle').text().trim();
      if (!title) return null;

      const company = $el.find('.companyName').text().trim() || 'Unknown Company';
      const location = $el.find('.companyLocation').text().trim() || 'UK';
      const salary = $el.find('.salaryText').text().trim();
      const description = $el.find('.job-snippet').text().trim();
      const date = $el.find('.date').text().trim();
      
      // Get apply URL - Indeed uses data-jk attribute
      const jk = $el.find('a[data-jk]').attr('data-jk') || $el.find('.jobTitle').attr('data-jk');
      const applyUrl = jk 
        ? `https://www.indeed.co.uk/viewjob?jk=${jk}&from=serp&vjs=3`
        : $el.find('.jobTitleLink').attr('href') || '';

      return {
        title,
        company,
        location,
        salary: salary || undefined,
        description,
        url: applyUrl,
        source: 'Indeed UK',
        postedDate: parseIndeedDate(date),
      };
    },
  },
  {
    name: 'Reed',
    baseUrl: 'https://www.reed.co.uk',
    searchUrl: 'https://www.reed.co.uk/jobs',
    selectors: {
      jobList: '.job-card',
      title: '.job-card__title',
      company: '.job-card__company-name',
      location: '.job-card__location',
      salary: '.job-card__salary',
      description: '.job-card__description',
      applyUrl: '.job-card__link',
      date: '.job-card__posted-date',
    },
    searchParams: (query, page) => ({
      query,
      location: 'United Kingdom',
      page: String(page + 1),
    }),
    transform: ($, element) => {
      const $el = $(element);
      const title = $el.find('.job-card__title').text().trim();
      if (!title) return null;

      const company = $el.find('.job-card__company-name').text().trim() || 'Unknown Company';
      const location = $el.find('.job-card__location').text().trim() || 'UK';
      const salary = $el.find('.job-card__salary').text().trim();
      const description = $el.find('.job-card__description').text().trim();
      const date = $el.find('.job-card__posted-date').text().trim();
      const relativeUrl = $el.find('.job-card__link').attr('href') || '';

      return {
        title,
        company,
        location,
        salary: salary || undefined,
        description,
        url: `https://www.reed.co.uk${relativeUrl}`,
        source: 'Reed',
        postedDate: parseReedDate(date),
      };
    },
  },
  {
    name: 'TotalJobs',
    baseUrl: 'https://www.totaljobs.com',
    searchUrl: 'https://www.totaljobs.com/jobs',
    selectors: {
      jobList: '.job-card',
      title: '.job-title',
      company: '.company-name',
      location: '.location',
      salary: '.salary',
      description: '.job-description',
      applyUrl: 'a.job-card__link',
      date: '.posted-date',
    },
    searchParams: (query, page) => ({
      keywords: query,
      location: 'United Kingdom',
      page: String(page + 1),
    }),
    transform: ($, element) => {
      const $el = $(element);
      const title = $el.find('.job-title').text().trim();
      if (!title) return null;

      const company = $el.find('.company-name').text().trim() || 'Unknown Company';
      const location = $el.find('.location').text().trim() || 'UK';
      const salary = $el.find('.salary').text().trim();
      const description = $el.find('.job-description').text().trim();
      const date = $el.find('.posted-date').text().trim();
      const relativeUrl = $el.find('a.job-card__link').attr('href') || '';

      return {
        title,
        company,
        location,
        salary: salary || undefined,
        description,
        url: relativeUrl.startsWith('http') ? relativeUrl : `https://www.totaljobs.com${relativeUrl}`,
        source: 'TotalJobs',
        postedDate: parseGenericDate(date),
      };
    },
  },
  {
    name: 'CWJobs',
    baseUrl: 'https://www.cwjobs.co.uk',
    searchUrl: 'https://www.cwjobs.co.uk/jobs',
    selectors: {
      jobList: '.job-card',
      title: '.job-title',
      company: '.company-name',
      location: '.location',
      salary: '.salary',
      description: '.job-description',
      applyUrl: 'a.job-card__link',
      date: '.posted-date',
    },
    searchParams: (query, page) => ({
      keywords: query,
      location: 'United Kingdom',
      page: String(page + 1),
    }),
    transform: ($, element) => {
      const $el = $(element);
      const title = $el.find('.job-title').text().trim();
      if (!title) return null;

      const company = $el.find('.company-name').text().trim() || 'Unknown Company';
      const location = $el.find('.location').text().trim() || 'UK';
      const salary = $el.find('.salary').text().trim();
      const description = $el.find('.job-description').text().trim();
      const date = $el.find('.posted-date').text().trim();
      const relativeUrl = $el.find('a.job-card__link').attr('href') || '';

      return {
        title,
        company,
        location,
        salary: salary || undefined,
        description,
        url: relativeUrl.startsWith('http') ? relativeUrl : `https://www.cwjobs.co.uk${relativeUrl}`,
        source: 'CWJobs',
        postedDate: parseGenericDate(date),
      };
    },
  },
];

// ============================================
// Date Parsing Helpers
// ============================================

function parseIndeedDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  const lower = dateStr.toLowerCase();
  const daysAgo = lower.match(/(\d+)\s*day/);
  const hoursAgo = lower.match(/(\d+)\s*hour/);
  
  const date = new Date();
  if (daysAgo) {
    date.setDate(date.getDate() - parseInt(daysAgo[1]));
  } else if (hoursAgo) {
    date.setHours(date.getHours() - parseInt(hoursAgo[1]));
  }
  
  return date.toISOString();
}

function parseReedDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  const lower = dateStr.toLowerCase();
  const match = lower.match(/(\d+)\s*(day|week|month)/);
  
  if (!match) return new Date().toISOString();
  
  const value = parseInt(match[1]);
  const unit = match[2];
  const date = new Date();
  
  if (unit.startsWith('day')) {
    date.setDate(date.getDate() - value);
  } else if (unit.startsWith('week')) {
    date.setDate(date.getDate() - value * 7);
  } else if (unit.startsWith('month')) {
    date.setMonth(date.getMonth() - value);
  }
  
  return date.toISOString();
}

function parseGenericDate(dateStr: string): string {
  return parseReedDate(dateStr);
}

// ============================================
// Scraper Functions
// ============================================

/**
 * Scrape jobs from a single site
 */
async function scrapeSite(config: SiteConfig, query: string, page: number = 0): Promise<Job[]> {
  try {
    console.log(`[Scraper] Scraping ${config.name} (page ${page + 1})...`);
    
    const params = config.searchParams(query, page);
    const response = await scraperClient.get(config.searchUrl, { params });
    
    if (response.status !== 200) {
      console.error(`[Scraper] ${config.name} returned status ${response.status}`);
      return [];
    }
    
    const $ = cheerio.load(response.data);
    const jobs: Job[] = [];
    
    $(config.selectors.jobList).each((_index, element) => {
      const transformed = config.transform($, element);
      if (transformed && transformed.title) {
        jobs.push({
          id: `${config.name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: transformed.title || '',
          company: transformed.company || 'Unknown Company',
          location: transformed.location || 'UK',
          salary: transformed.salary,
          description: transformed.description || '',
          url: transformed.url || '',
          source: transformed.source || config.name,
          postedDate: transformed.postedDate || new Date().toISOString(),
        });
      }
    });
    
    console.log(`[Scraper] ${config.name}: Found ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`[Scraper] ${config.name} error:`, axiosError.message);
    return [];
  }
}

/**
 * Validate that an apply URL is working
 */
async function validateApplyUrl(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    // Just check if the URL is valid and reachable
    // We do a HEAD request to avoid downloading the full page
    const response = await scraperClient.head(url, {
      timeout: 5000,
      maxRedirects: 5,
    });
    return response.status >= 200 && response.status < 400;
  } catch {
    // URL might still work (some sites block HEAD)
    // We'll assume it's valid if it's a well-formed URL
    return isValidUrl(url);
  }
}

/**
 * Basic URL validation
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Scrape all configured sites for jobs
 * Priority: JSearch API -> Site Scrapers
 */
export async function scrapeAllSites(query: string = 'student job internship'): Promise<Job[]> {
  console.log('[Scraper] Starting job search...');
  
  // Try JSearch API first
  const jsearchJobs = await fetchJobsFromJSearch(query);
  if (jsearchJobs.length > 0 && jsearchJobs[0].url && !jsearchJobs[0].url.includes('example')) {
    console.log(`[Scraper] JSearch found ${jsearchJobs.length} jobs`);
    return jsearchJobs;
  }
  
  // Try Jooble API
  const joobleJobs = await fetchJobsFromJooble(query);
  if (joobleJobs.length > 0 && joobleJobs[0].url && !joobleJobs[0].url.includes('example')) {
    console.log(`[Scraper] Jooble found ${joobleJobs.length} jobs`);
    return joobleJobs;
  }
  
  // Try Adzuna API
  const adzunaJobs = await fetchJobsFromAdzuna(query);
  if (adzunaJobs.length > 0 && adzunaJobs[0].url && !adzunaJobs[0].url.includes('example')) {
    console.log(`[Scraper] Adzuna found ${adzunaJobs.length} jobs`);
    return adzunaJobs;
  }
  
  // Fallback to site scraping
  console.log('[Scraper] APIs unavailable, falling back to site scraping...');
  
  const allJobs: Job[] = [];
  const maxPages = 1; // Reduce pages to avoid timeouts
  
  for (const config of siteConfigs) {
    for (let page = 0; page < maxPages; page++) {
      const jobs = await scrapeSite(config, query, page);
      
      // Validate and filter jobs with valid URLs
      const validatedJobs: Job[] = [];
      for (const job of jobs) {
        if (job.url && isValidUrl(job.url)) {
          validatedJobs.push(job);
        }
      }
      
      allJobs.push(...validatedJobs);
      
      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Remove duplicates based on URL
  const uniqueJobs = removeDuplicateJobs(allJobs);
  
  console.log(`[Scraper] Total jobs found: ${uniqueJobs.length}`);
  return uniqueJobs;
}

/**
 * Remove duplicate jobs based on URL
 */
function removeDuplicateJobs(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  const unique: Job[] = [];
  
  for (const job of jobs) {
    if (!seen.has(job.url)) {
      seen.add(job.url);
      unique.push(job);
    }
  }
  
  return unique;
}

/**
 * Get available scraper sources
 */
export function getAvailableSources(): string[] {
  return siteConfigs.map(config => config.name);
}

/**
 * Scrape a specific site
 */
export async function scrapeSpecificSite(siteName: string, query: string): Promise<Job[]> {
  const config = siteConfigs.find(c => c.name.toLowerCase() === siteName.toLowerCase());
  
  if (!config) {
    console.error(`[Scraper] Unknown site: ${siteName}`);
    return [];
  }
  
  const jobs = await scrapeSite(config, query, 0);
  
  // Validate URLs
  const validatedJobs: Job[] = [];
  for (const job of jobs) {
    if (job.url && isValidUrl(job.url)) {
      validatedJobs.push(job);
    }
  }
  
  return validatedJobs;
}

export default {
  scrapeAllSites,
  scrapeSpecificSite,
  getAvailableSources,
  validateApplyUrl,
};
