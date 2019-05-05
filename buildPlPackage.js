const fsp = require("./module/fsPromise");
const plBuild = require("./module/buildPlSql");
const fs = require("fs");

const packageList = ["./plsql/demo", "./plsql/pkg_nmhieu_tool"];

(function() {
  for (const packageName of packageList) {
    buildAPackage(packageName);
  }

  async function buildAPackage(packagePath) {
    let plfiles = [];

    try {
      plfiles = await fsp.readDir(packagePath);
    } catch (e) {
      console.log("Error in buildPlPackage: ", e);
    }

    function getFilePath(filePath) {
      return packagePath + "/" + filePath;
    }

    for (const filePath of plfiles) {
      if (
        String(filePath).endsWith(".pck") &&
        !String(filePath).includes(".compiled.")
      ) {
        const filename = filePath.substring(0, filePath.lastIndexOf(".pck"));
        let contentAfterBuild = "";
        try {
          contentAfterBuild = await plBuild(getFilePath(filePath), packagePath);
        } catch (e) {
          console.log("Error in buildPlPackage: ", e);
        }

        fs.writeFileSync(
          getFilePath(filename) + ".compiled.pck",
          contentAfterBuild
        );
      }
    }
  }
})();
