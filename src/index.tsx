import { Renderer } from "./Renderer";
import { getHTMLS } from "./main";

async function run() {
  const renderer = new Renderer(getHTMLS());
  await renderer.renderToPNGs(i => `out/test_${i}.png`);
}

run();