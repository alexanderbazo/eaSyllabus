import "dotenv/config";
import glob from "glob-promise";

import CourseBuilder from "./src/CourseBuilder.js";
import PageBuilder from "./src/PageBuilder.js";

async function collectCourseFilesFrom(dir) {
  let files = await glob(`${dir}/**/*.md`);
  return files;
}

async function loadCourses(dir) {
  console.log("Loading courses ..."); // eslint-disable-line no-console
  let courseFiles = await collectCourseFilesFrom(dir),
    courses = await CourseBuilder.loadCoursesFromFiles(courseFiles);
  return courses;
}

async function createPages(courses, templateFile) {
  console.log("Creating pages ..."); // eslint-disable-line no-console
  courses.forEach(async (course) => {
    await PageBuilder.createPage(course, templateFile);
  });
}

async function run() {
  let courses = await loadCourses(process.env.DATA_DIR);
  createPages(courses, process.env.TEMPLATE_FILE);
}

run();