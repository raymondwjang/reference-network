const path = require("path");
const fs = require("fs");
const esbuild = require("esbuild");
const rmrf = require("rimraf");

// Clear the 'gen' directory synchronously
rmrf.sync("gen");

// Load Zotero plugin tasks
require("zotero-plugin/copy-assets");
require("zotero-plugin/rdf");
require("zotero-plugin/version");

// Helper function to replace TypeScript file extension with JavaScript
function replaceExtToJs(src) {
  return src.replace(/[.]ts$/, ".js");
}

// Bundles the files with the provided configuration
async function bundle(config) {
  // Default configuration enhanced with custom settings
  config = {
    bundle: true,
    format: "iife",
    target: ["firefox60"],
    inject: [],
    treeShaking: true,
    keepNames: true,
    ...config,
  };

  let target = determineTarget(config);

  const exportGlobals = config.exportGlobals;
  delete config.exportGlobals;

  if (exportGlobals) {
    await handleExportGlobals(config);
  }

  console.log("* bundling", target);
  await esbuild.build(config);

  if (exportGlobals) {
    await rewriteGlobals(target, config);
  }
}

// Determine the target file or directory for output
function determineTarget(config) {
  if (config.outfile) {
    return config.outfile;
  } else if (config.entryPoints.length === 1 && config.outdir) {
    return path.join(
      config.outdir,
      replaceExtToJs(path.basename(config.entryPoints[0]))
    );
  } else {
    return `${config.outdir} [${config.entryPoints
      .map(replaceExtToJs)
      .join(", ")}]`;
  }
}

// Handle export of globals when required
async function handleExportGlobals(config) {
  const esm = await esbuild.build({
    ...config,
    logLevel: "silent",
    format: "esm",
    metafile: true,
    write: false,
  });
  if (Object.values(esm.metafile.outputs).length !== 1) {
    throw new Error("exportGlobals not supported for multiple outputs");
  }
  for (const output of Object.values(esm.metafile.outputs)) {
    if (output.entryPoint) {
      config.globalName = escape(
        `{ ${output.exports.sort().join(", ")} }`
      ).replace(/%/g, "$");
    }
  }
}

// Rewrite global variable names in the output files
async function rewriteGlobals(target, config) {
  const originalContent = await fs.promises.readFile(target, "utf-8");
  const modifiedContent = originalContent.replace(
    config.globalName,
    unescape(config.globalName.replace(/[$]/g, "%"))
  );
  await fs.promises.writeFile(target, modifiedContent);
}

// Main build function
async function build() {
  await bundle({
    exportGlobals: true,
    entryPoints: ["src/bootstrap.ts"],
    outdir: "build",
  });

  await bundle({
    entryPoints: ["src/prefs/prefs.ts"],
    outdir: "build",
  });
}

// Run build and handle any errors
build().catch((err) => {
  console.log(err);
  process.exit(1);
});
