/* eslint-disable prefer-arrow/prefer-arrow-functions, no-var, @typescript-eslint/no-unused-vars, no-caller, @typescript-eslint/explicit-module-boundary-types */

declare const dump: (msg: string) => void
declare const Components: any
declare const ChromeUtils: any
declare var Services: any
const {
  interfaces: Ci,
  results: Cr,
  utils: Cu,
  Constructor: CC,
} = Components

var stylesheetID = 'reference-network-stylesheet'
var ftlID = 'reference-network-ftl'
var menuitemID = 'make-it-green-instead'
var addedElementIDs = [stylesheetID, ftlID, menuitemID]

if (typeof Zotero == 'undefined') {
  var Zotero
}

function log(msg) {
  Zotero.debug(`Reference Network: ${  msg}`)
}

// In Zotero 6, bootstrap methods are called before Zotero is initialized, and using include.js
// to get the Zotero XPCOM service would risk breaking Zotero startup. Instead, wait for the main
// Zotero window to open and get the Zotero object from there.
//
// In Zotero 7, bootstrap methods are not called until Zotero is initialized, and the 'Zotero' is
// automatically made available.
async function waitForZotero() {
  if (typeof Zotero != 'undefined') {
    await Zotero.initializationPromise
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  var { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm')
  var windows = Services.wm.getEnumerator('navigator:browser')
  var found = false
  while (windows.hasMoreElements()) {
    const win = windows.getNext()
    if (win.Zotero) {
      Zotero = win.Zotero
      found = true
      break
    }
  }
  if (!found) {
    await new Promise(resolve => {
      var listener = {
        onOpenWindow(aWindow) {
          // Wait for the window to finish loading
          const domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
            .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow)
          domWindow.addEventListener('load', function() {
            domWindow.removeEventListener('load', arguments.callee, false)
            if (domWindow.Zotero) {
              Services.wm.removeListener(listener)
              Zotero = domWindow.Zotero
              resolve(undefined)
            }
          }, false)
        },
      }
      Services.wm.addListener(listener)
    })
  }
  await Zotero.initializationPromise
}


// Loads default preferences from prefs.js in Zotero 6
function setDefaultPrefs(rootURI) {
  var branch = Services.prefs.getDefaultBranch('')
  var obj = {
    pref(pref, value) {
      switch (typeof value) {
        case 'boolean':
          branch.setBoolPref(pref, value)
          break
        case 'string':
          branch.setStringPref(pref, value)
          break
        case 'number':
          branch.setIntPref(pref, value)
          break
        default:
          Zotero.logError(`Invalid type '${typeof(value)}' for pref '${pref}'`)
      }
    },
  }
  Services.scriptloader.loadSubScript(`${rootURI  }prefs.js`, obj)
}


export async function install() {
  await waitForZotero()

  log('Installed')
}

export async function startup({ id, version, resourceURI, rootURI = resourceURI.spec }) {
  await waitForZotero()

  log('Starting')

  // 'Services' may not be available in Zotero 6
  if (typeof Services == 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    var { Services } = ChromeUtils.import('resource://gre/modules/Services.jsm')
  }

  // Read prefs from prefs.js when the plugin in Zotero 6
  if (Zotero.platformMajorVersion < 102) {
    setDefaultPrefs(rootURI)
  }

  // Add DOM elements to the main Zotero pane
  var win = Zotero.getMainWindow()
  if (win && win.ZoteroPane) {
    const zp = win.ZoteroPane
    const doc = win.document
    // createElementNS() necessary in Zotero 6; createElement() defaults to HTML in Zotero 7
    const HTML_NS = 'http://www.w3.org/1999/xhtml'
    const XUL_NS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
    const link1 = doc.createElementNS(HTML_NS, 'link')
    link1.id = stylesheetID
    link1.type = 'text/css'
    link1.rel = 'stylesheet'
    link1.href = `${rootURI  }style.css`
    doc.documentElement.appendChild(link1)

    const menuitem = doc.createElementNS(XUL_NS, 'menuitem')
    menuitem.id = menuitemID
    menuitem.setAttribute('type', 'checkbox')
    menuitem.setAttribute('data-l10n-id', 'make-it-green-instead')
    menuitem.addEventListener('command', () => {
      Zotero.ReferenceNetwork.toggleGreen(menuitem.getAttribute('checked') === 'true')
    })
    doc.getElementById('menu_viewPopup').appendChild(menuitem)

    // Use strings from reference-network.properties (legacy properties format) in Zotero 6
    // and from reference-network.ftl (Fluent) in Zotero 7
    if (Zotero.platformMajorVersion < 102) {
      const stringBundle = Services.strings.createBundle('chrome://reference-network/locale/reference-network.properties')
      Zotero.getMainWindow().document.getElementById('make-it-green-instead')
        .setAttribute('label', stringBundle.GetStringFromName('makeItGreenInstead.label'))
    }
    else {
      const link2 = doc.createElementNS(HTML_NS, 'link')
      link2.id = ftlID
      link2.rel = 'localization'
      link2.href = 'reference-network.ftl'
      doc.documentElement.appendChild(link2)
    }
  }

  Services.scriptloader.loadSubScript(`${rootURI  }lib.js`)
  Zotero.ReferenceNetwork.foo()
}

export function shutdown() {
  log('Shutting down')

  // Remove stylesheet
  var zp = Zotero.getActiveZoteroPane()
  if (zp) {
    for (const id of addedElementIDs) {
      // ?. (null coalescing operator) not available in Zotero 6
      const elem = zp.document.getElementById(id)
      if (elem) elem.remove()
    }
  }

  Zotero.ReferenceNetwork = undefined
}

export function uninstall() {
  // `Zotero` object isn't available in `uninstall()` in Zotero 6, so log manually
  if (typeof Zotero == 'undefined') {
    dump('Reference Network: Uninstalled\n\n')
    return
  }

  log('Uninstalled')
}
