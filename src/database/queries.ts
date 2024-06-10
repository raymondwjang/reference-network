export const SQLQueries = {
  getDOIs: `
          SELECT value -- iD.itemID, iDV.valueID, fieldName
          FROM itemDataValues AS iDV
                   LEFT JOIN itemData AS iD ON iDV.valueID = iD.valueID
                   LEFT JOIN fields AS f ON iD.fieldID = f.fieldID
                   LEFT JOIN items AS i ON iD.itemID = i.itemID
          WHERE fieldName = 'DOI'
            AND libraryID = 1;
      `,
};
