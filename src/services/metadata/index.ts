import cheerio from 'cheerio';
import fetch from 'node-fetch';

export async function fetchSiteToken(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    let token: string | undefined;
    $('meta[name^="zoomment"]').each((index, element) => {
      token = $(element).attr('content');
    });

    return token;
  } catch (error: any) {
    console.error('Error fetching or parsing the HTML:', error.message);
    return undefined;
  }
}
