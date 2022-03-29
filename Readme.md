# eaSyllabus

**eaSyllabus** allows for easy creation and editing of online viewable course descriptions. Each course is described in a **Markdown** file with some **YAML** front matter. **eaSyllabus** creates individual **HTML** files for each description. An **GitHub Action** deploys these HTML files through **GitHub Pages**.

## Contribute

- Create a new _Markdown_ file in `courses`. You may want to use `courses/mme-ss-22.md` as a template. Do not forget to change the `page` attribute.
- Describe your course.
- Commit your changes. Your syllabus is automatically deployed (https://easyllabus.software-engineering.education/PAGENAME).