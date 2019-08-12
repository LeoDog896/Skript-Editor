const fs              = require('fs').promises;
const marked          = require('marked')
const sanitizeHtml    = require('sanitize-html');
class Markdown {
  buildText async (txt, options) => {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="description" content="${options.desc}"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1>
    <title>${options.title}</title>
  </head>
  <body>
    ${sanitizeHtml(marked.parse(txt))}
    <style scoped> @import url("${options.style}");</style>
  </body>
</html>
`
  },
  
  buildFile: async (file, options) => {
    console.log(await fs.readFile(file, 'utf8'))
    return this.buildText(await fs.readFile(file, 'utf8'), options)
  }
}
module.exports = {
  buildText: async (txt, options) => {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="description" content="${options.desc}"/>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1>
    <title>${options.title}</title>
  </head>
  <body>
    ${sanitizeHtml(marked.parse(txt))}
    <style scoped> @import url("${options.style}");</style>
  </body>
</html>
`
  },
  
  buildFile: async (file, options) => {
    console.log(await fs.readFile(file, 'utf8'))
    return this.buildText(await fs.readFile(file, 'utf8'), options)
  }
}