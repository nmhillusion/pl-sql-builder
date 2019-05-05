const fsp = require("./fsPromise");
const fs = require("fs");

async function build(pathname, dirname = ".") {
  let contentFile = "";
  try {
    contentFile = await fsp.readFile(pathname);
    contentFile = contentFile.toString();

    contentFile = contentFile.replace(
      /--\[\[include\(['"](.*?)['"]\)\]\]/gi,
      function replacerWithPromise(match, grp) {
        grp = grp.replace(
          "{package-name}",
          pathname.substring(
            pathname.lastIndexOf("/"),
            pathname.lastIndexOf(".pck")
          )
        );
        const filePath = String(grp).startsWith(".")
          ? dirname + grp.substring(1)
          : grp;

        return fs.readFileSync(filePath);
      }
    );

    console.log("compile done for: ", pathname);
  } catch (e) {
    console.log("Error in buildPlSql: ", e);
  }
  return contentFile;
}

module.exports = build;
