document.addEventListener("DOMContentLoaded", () => {
  // Example of setting and getting a preference
  const prefElement = document.getElementById(
    "example-pref"
  ) as HTMLInputElement;

  // Load existing preference value
  let prefValue = Zotero.Prefs.get(
    "extensions.reference-network.examplePref",
    true
  );
  if (typeof prefValue !== "boolean") {
    prefValue = !!prefValue; // Convert to boolean if it's not
  }
  prefElement.checked = prefValue;

  // Save preference value on change
  prefElement.addEventListener("change", () => {
    Zotero.Prefs.set(
      "extensions.reference-network.examplePref",
      prefElement.checked
    );
  });
});
