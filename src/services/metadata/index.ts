import cheerio from 'cheerio';
import axios from 'axios';

export async function fetchSiteToken(url: string) {
  try {
    const html = await axios.get<string, string>(url, { responseType: 'text' });
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
