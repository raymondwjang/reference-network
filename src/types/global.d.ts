import "zotero-types";

declare const Zotero: _ZoteroTypes.Zotero;
// declare const rootURI: string;
declare global {
  interface Window {
    ZoteroPane?: _ZoteroTypes.ZoteroPane;
    MozXULElement?: any;
  }
  interface Document {
    createXULElement<T extends keyof HTMLElementTagNameMap>(
      tagName: T
    ): HTMLElementTagNameMap[T];
  }
  interface HTMLElementTagNameMap {
    menuitem: HTMLElement;
  }
}
