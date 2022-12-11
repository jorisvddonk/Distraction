import puppeteer from "puppeteer";
import { Builder } from ".";

export class Renderer {
  constructor(private builder: Builder) { }
  public async renderToPNGs(pathFunc: (i: number) => string) {
    const browser = await puppeteer.launch();
    const htmls = this.builder.buildMultipage();
    for (let i = 0; i < htmls.length; i++) {
      const page = await browser.newPage();
      await page.setContent(htmls[i]);
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
    const browser = await puppeteer.launch();
    const html = this.builder.buildSinglePage();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMediaType('screen');
    await page.pdf({
      path: path,
      omitBackground: true
    });
    await browser.close();
  }
}