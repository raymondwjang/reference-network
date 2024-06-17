declare const Zotero: any;
declare const location: any;

const worker = typeof location !== "undefined" && location.search; // this is false
export const is7 = worker
  ? new URLSearchParams(location.search).get("is7") === "true" // location is chrome://zotero/content/zoteroPane.xhtml
  : Zotero.platformMajorVersion >= 102; // 115 on mine, May 20, 2024 --> is7 is true

function clientname(): string {
  if (typeof location !== "undefined" && location.search) {
    return new URLSearchParams(location.search).get("clientName");
  }
  // if (process.versions.node) return 'Zotero' // testing
  if (Zotero.clientName) return Zotero.clientName as string;
  if (Zotero.Weaver?.clientName) {
    return Zotero.Weaver.clientName as string;
  }
  throw new Error("Unable to detect clientName");
}

export const platform = {
  name: "",
  windows: false,
  mac: false,
  linux: false,
};

if (worker) {
  platform.name = new URLSearchParams(location.search).get("platform");
  platform.windows = platform.name === "win";
  platform.mac = platform.name === "mac";
  platform.linux = platform.name === "lin";
} else {
  platform.name = Zotero.isWin
    ? "win"
    : Zotero.isMac
    ? "mac"
    : Zotero.isLinux
    ? "lin"
    : "unk";
  platform.windows = Zotero.isWin;
  platform.mac = Zotero.isMac;
  platform.linux = Zotero.isLinux;
}

export const clientName = clientname();
export const client = clientName.toLowerCase().replace("-", "");
