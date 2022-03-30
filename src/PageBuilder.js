import fs from "fs/promises";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

async function loadPageTemplate(template) {
  let fileContent = await fs.readFile(template, "utf-8");
  return fileContent;
}

function inflateTemplateFrom(document, query) {
  let el = document.createElement("div");
  el.innerHTML = document.querySelector(query).innerHTML.trim();
  return el.firstChild;
}

class PageBuilder {

  async createPage(course, templateFile) {
    let template = await loadPageTemplate(templateFile),
      document = new JSDOM(template).window.document;
    document.querySelector("title").innerHTML = course.title;
    document.querySelector("#sidebar").setAttribute("lang", course.language);
    document.querySelector("#sidebar .chair").innerHTML = course.context.chair
      .name;
    document.querySelector("#sidebar .chair").href = course.context.chair
      .link;
    document.querySelector("#sidebar .program .name a").innerHTML = course
      .context.program.name;
    document.querySelector("#sidebar .program .name a").href = course.context
      .program.link;
    document.querySelector("#sidebar .program .name .degree").innerHTML =
      `(${course.context.program.degree})`;
    document.querySelector("#sidebar h1").innerHTML = course.title;
    document.querySelector("#sidebar .semester").innerHTML = course.semester;
    course.links.forEach((link) => {
      let el = inflateTemplateFrom(document, ".link-list template");
      el.querySelector("a").innerHTML = link.name;
      el.querySelector("a").href = link.link;
      document.querySelector("#sidebar .link-list").append(el);
    });
    course.trainers.forEach((trainer) => {
      let el = inflateTemplateFrom(document, ".trainers template");
      el.querySelector("img").src = trainer.image;
      el.querySelector(".name").innerHTML = trainer.name;
      el.querySelector(".role").innerHTML = trainer.role;
      el.querySelector(".website a").href = trainer.website;
      el.querySelector(".email a").href = `mailto:${trainer.email}`;
      document.querySelector(".trainers").append(el);
    });
    document.querySelector("#content").setAttribute("lang", course.language);
    document.querySelector("#content").innerHTML = course.html;
    await fs.writeFile(`${process.env.OUTPUT_DIR}/${course.page}.html`, document.querySelector("html").innerHTML);
  }

}

export default new PageBuilder();