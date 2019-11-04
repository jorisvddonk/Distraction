import puppeteer from "puppeteer";

export class Renderer {
  constructor(private htmls: string[]) { }
  public async renderToPNGs(pathFunc: (i: number) => string) {
    const browser = await puppeteer.launch();
    for (let i = 0; i < this.htmls.length; i++) {
      const page = await browser.newPage();
      await page.setContent(this.htmls[i]);
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
}