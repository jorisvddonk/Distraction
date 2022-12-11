import { Builder } from ".";
import { chromium, Browser, BrowserContext } from "playwright";

export interface IRendererOptions {
  deviceScaleFactor: number;
}
export class Renderer {
  private options: Required<IRendererOptions>;
  constructor(private builder: Builder, options?: IRendererOptions) {
    this.options = Object.assign({
      deviceScaleFactor: 1
    }, options);
  }

  private browser?: Browser = undefined;

  private async getBrowser() {
    //const browser = await firefox.launch(); // Firefox does not support PDFs!
    const browser = await chromium.launch();
    return browser;
  }

  private async emulateMedia(page: any) {
    await page.emulateMedia({ media: 'screen' });
  }

  private async init() {
    if (!this.browser) {
      this.browser = await this.getBrowser();
    }
    return await this.browser.newContext({
      deviceScaleFactor: this.options.deviceScaleFactor
    });
  }

  public async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }
  }

  public async renderToPNGs(pathFunc: (i: number) => string) {
    const browserContext = await this.init();
    const htmls = this.builder.buildMultipage();
    for (let i = 0; i < htmls.length; i++) {
      const page = await browserContext.newPage();
      await page.setContent(htmls[i]);
      await page.setViewportSize({
        width: 794,
        height: 1122
      });
      await this.emulateMedia(page);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: pathFunc(i),
        type: "png",
        scale: "device",
        omitBackground: false,
        clip: {
          width: 794,
          height: 1122,
          x: 0,
          y: 0
        }
      });
    }
    await browserContext.close();
  }

  /**
   * Render as PDF
   * NOTE: currently not recommended since Chrome has an odd problem where certain elements aren't positioned correctly...
   * @param path Path to save PDF to
   */
  public async renderToPDF(path: string) {
    const browserContext = await this.init();
    const html = this.builder.buildSinglePage();
    const page = await browserContext.newPage();
    await page.setContent(html);
    await this.emulateMedia(page);
    await page.pdf({
      path: path,
      printBackground: true
    });
    await browserContext.close();
  }
}