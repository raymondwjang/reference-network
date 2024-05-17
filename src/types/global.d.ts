import "zotero-types";

declare const Zotero: _ZoteroTypes.Zotero;
declare global {
  interface Window {
    ZoteroPane: _ZoteroTypes.ZoteroPane;
  }
}
