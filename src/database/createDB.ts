Zotero.ZoteroDBTest = {
  async testDBConnection() {
    try {
      const results = await Zotero.DB.query(
        "SELECT itemID, title FROM items LIMIT 10"
      );
      Zotero.debug(
        "Connected successfully. Sample items from Zotero's database:"
      );
      results.forEach((item) => {
        Zotero.debug(`Item ID: ${item.itemID}, Title: ${item.title}`);
      });
    } catch (error) {
      Zotero.debug("Error querying items table:", error);
    }
  },
};

// Running the test function when Zotero starts
if (Zotero.initializationPromise) {
  Zotero.initializationPromise.then(() =>
    Zotero.ZoteroDBTest.testDBConnection()
  );
} else {
  Zotero.ZoteroDBTest.testDBConnection();
}
