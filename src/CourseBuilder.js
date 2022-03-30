import fs from "fs/promises";
import YAML from "yaml";
import showdown from "showdown";

var markdownConverter = new showdown.Converter({ tables: "true" });

function parseFile(fileContent) {
  let yaml = fileContent.split("---")[1],
    meta = YAML.parse(yaml),
    markdown = fileContent.substring(yaml.length + 1).replace("---", "").trim();
  meta.html = markdownConverter.makeHtml(markdown);
  return meta;
}

async function extractFileContentToJSON(file) {
  let fileContent = await fs.readFile(file, "utf-8"),
    rawCourseData = parseFile(fileContent);
  return rawCourseData;
}

class CourseBuilder {

  async loadCoursesFromFiles(files) {
    let raw = await Promise.all(files.map((file) => extractFileContentToJSON(
        file))),
      courses = raw.map((raw) => Course.fromJSON(raw));
    return courses;
  }

}

class Course {

  constructor(title, page, language, context, semester, links, trainers, html) {
    this.title = title;
    this.page = page;
    this.language = language;
    this.context = context;
    this.semester = semester;
    this.links = links;
    this.trainers = trainers;
    this.html = html;
    Object.freeze(this);
  }

  static fromJSON(json) {
    return new Course(json.title, json.page, json.language, json.context, json.semester, json
      .links, json.trainers, json.html);
  }

}

export default new CourseBuilder();