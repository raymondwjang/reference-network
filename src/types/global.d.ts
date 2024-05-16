import "zotero-types";

declare const Zotero: _ZoteroTypes.Zotero;
declare var ReferenceNetwork: {
  id: string | null;
  version: string | null;
  rootURI: string | null;
  initialized: boolean;
  addedElementIDs: string[];

  init({
    id,
    version,
    rootURI,
  }: {
    id: string;
    version: string;
    rootURI: string;
  }): void;
  log(msg: string): void;
  toggleGreen(enabled: boolean): void;
  main(): Promise<void>;
};

export {};
