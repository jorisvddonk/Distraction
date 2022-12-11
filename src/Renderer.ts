import puppeteer from "puppeteer";
import { Builder } from ".";
import { chromium } from "playwright";
export class Renderer {
  constructor(private builder: Builder) { }
  
  private static async getBrowser__puppeteer() {
    const browser = await puppeteer.launch();
    return browser;
  }

  private static async getBrowser() {
    //const browser = await firefox.launch();
    const browser = await chromium.launch();
    return browser;
  }

  private async emulateMedia(page: any) {
      //await page.emulateMediaType('screen'); // Puppeteer API
      await page.emulateMedia({media: 'screen'}); // Playwright API
  }

  public async renderToPNGs(pathFunc: (i: number) => string) {
    const browser = await Renderer.getBrowser();
    const htmls = this.builder.buildMultipage();
    for (let i = 0; i < htmls.length; i++) {
      const page = await browser.newPage();
      await page.setContent(htmls[i]);
      await this.emulateMedia(page);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: pathFunc(i),
        type: "png",
        clip: {
          width: 794,
          height: 1122,
          x: 0,
          y: 0
        }
      });
    }
    await browser.close();
  }

  /**
   * Render as PDF
   * NOTE: currently not recommended since Chrome has an odd problem where certain elements aren't positioned correctly...
   * @param path Path to save PDF to
   */
  public async renderToPDF(path: string) {
    const browser = await Renderer.getBrowser();
    const html = this.builder.buildSinglePage();
    const page = await browser.newPage();
    await page.setContent(html);
    await this.emulateMedia(page);
    await page.pdf({
      path: path,
      printBackground: true
    });
    await browser.close();
  }
}