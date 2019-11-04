import { getElements } from "./main";
import ReactDOM from "react-dom";
import { Builder } from "./Builder";
ReactDOM.render(getElements(), document.getElementById("main"));

// todo: add stylesheet instead of overriding
document.getElementsByTagName('style')[0].innerHTML = Builder.getRootStylesheet();