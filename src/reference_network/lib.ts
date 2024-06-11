import { initUI, destroyUI } from "./ui/ui";

declare const Zotero: any
declare const Components: any
const {
  // classes: Cc,
  // interfaces: Ci,
  utils: Cu,
} = Components

if (Zotero.platformMajorVersion < 102) {
  Cu.importGlobalProperties(['URL'])
}

Zotero.ReferenceNetwork = new class {
  log(msg) {
    Zotero.debug(`Reference Network: ${  msg}`)
  }

  foo() {
    // Global properties are imported above in Zotero 6 and included automatically in
    // Zotero 7
    const host = new URL('https://foo.com/path').host
    this.log(`Host is ${host}`)

    this.log(`Intensity is ${Zotero.Prefs.get('extensions.reference-network.intensity', true)}`)

    this.log(Zotero.getMainWindow().speechSynthesis)
  }

  toggleGreen(enabled) {
    const docElem = Zotero.getMainWindow().document.documentElement
    // Element#toggleAttribute() is not supported in Zotero 6
    if (enabled) {
      docElem.setAttribute('data-green-instead', 'true')
    }
    else {
      docElem.removeAttribute('data-green-instead')
    }
  }

  initUI(){
    initUI();
  }

  destroyUI(zp){
    destroyUI(zp);
  }
}
