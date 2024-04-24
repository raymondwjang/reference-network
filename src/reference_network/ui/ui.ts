import { addContextMenu } from "./menus";

export const initUI = (window) => {
  addContextMenu(window);
}

// Remove any added items from the DOM
export const destroyUI = (zp) => {
  // if (zp) {
  //   for (const id of addedElementIDs) {
  //     // ?. (null coalescing operator) not available in Zotero 6
  //     const elem = zp.document.getElementById(id)
  //     if (elem) elem.remove()
  //   }
  // }
}
