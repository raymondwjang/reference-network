export class ApiManager {
  private apiUrl: string = "https://api.openalex.org/";
  private userAgent: string;

  constructor(apiUrl: string, userAgent: string) {
    this.apiUrl = apiUrl;
    this.userAgent = userAgent;
  }

  async fetchDOI(doi: string): Promise<any> {
    const url =
      this.apiUrl + `works/https://doi.org/${encodeURIComponent(doi)}`;
    try {
      const response = await Zotero.HTTP.request("GET", url, {
        headers: {
          "User-Agent": this.userAgent,
        },
      });
      const data = JSON.parse(response.responseText);
      return data;
    } catch (error) {
      Zotero.logError(error);
      throw error; // Re-throw to handle it in the calling function
    }
  }

  async fetchDOIs(dois: string[], batchSize: number = 50): Promise<any[]> {
    let url: string = "";
    const data = []; // Array to collect data from all batches

    while (dois.length > batchSize) {
      url =
        this.apiUrl + `works?filter=doi:${dois.slice(0, batchSize).join("|")}`;
      try {
        const response = await Zotero.HTTP.request("GET", url, {
          headers: {
            "User-Agent": this.userAgent,
          },
        });
        const dataBatch = JSON.parse(response.responseText);
        data.push(dataBatch); // Store the batch data
      } catch (error) {
        Zotero.logError(error);
        throw error;
      }
      dois = dois.slice(batchSize);
    }

    url = this.apiUrl + `works?filter=doi:${dois.join("|")}`;
    try {
      const response = await Zotero.HTTP.request("GET", url, {
        headers: {
          "User-Agent": this.userAgent,
        },
      });
      const dataBatch = JSON.parse(response.responseText);
      data.push(dataBatch); // Store the last batch data
    } catch (error) {
      Zotero.logError(error);
      throw error;
    }

    return data;
  }
}
