// Default Preferences

// In Zotero 6, default preferences could be set by creating .js files in your plugin's defaults/preferences/ folder:
// pref("extensions.make-it-red.intensity", 100);
// These default preferences are loaded automatically at startup. While this works fine for overlay plugins,
// which require a restart, bootstrapped plugins can be installed or enabled at any time, and their default
// preferences are not read until Zotero is restarted.
// In Zotero 7, default preferences should be placed in a prefs.js file in the plugin root, following the same
// format as above. These preferences will be read when plugins are installed or enabled and then on every startup.

// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("example-pref") as HTMLInputElement;

  // Load the saved checkbox state from localStorage and apply it
  const savedCheckboxState = localStorage.getItem("examplePrefChecked");
  if (savedCheckboxState) {
    checkbox.checked = savedCheckboxState === "true";
  }

  // Add an event listener for changes to the checkbox
  checkbox.addEventListener("change", () => {
    // Save the new state of the checkbox to localStorage
    localStorage.setItem("examplePrefChecked", checkbox.checked.toString());
  });
});
