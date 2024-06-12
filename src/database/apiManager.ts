export class ApiManager {
  private apiUrl: string = "https://api.openalex.org/";
  private userAgent: string;
  private headers: Record<string, string>;

  constructor(apiUrl: string, userAgent: string) {
    this.apiUrl = apiUrl;
    this.userAgent = userAgent;
    this.headers = {
      "User-Agent": this.userAgent,
    };
  }

  private log(msg: string): void {
    Zotero.log(msg, "warning", "Reference Network: apiManager.ts");
  }

  private logError(error: Error): void {
    Zotero.logError(error);
  }

  async fetchReference(doi: string): Promise<any> {
    const url =
      this.apiUrl + `works/https://doi.org/${encodeURIComponent(doi)}`;
    try {
      const response = await Zotero.HTTP.request("GET", url, {
        headers: this.headers,
      });
      const data = JSON.parse(response.responseText);
      return data;
    } catch (error) {
      Zotero.logError(error);
      throw error; // Re-throw to handle it in the calling function
    }
  }

  async fetchReferences(
    dois: string[],
    batchSize: number = 25
  ): Promise<any[]> {
    const data = [];
    let index = 0;

    while (index < dois.length) {
      const batchDOIs = dois.slice(index, index + batchSize);
      const url = this.apiUrl + `works?filter=doi:${batchDOIs.join("|")}`;
      this.log(`Fetching batch of DOIs: ${url}`);
      try {
        const response = await Zotero.HTTP.request("GET", url, {
          headers: this.headers,
        });
        const dataBatch = JSON.parse(response.responseText);
        data.push(dataBatch); // Store the batch data
      } catch (error) {
        this.logError(error);
        throw error; // Re-throw the error after logging it
      }

      index += batchSize; // Move the index forward by batchSize
    }

    return data;
  }

  public async fetchCitedBy(openAlexID: string, url?: string): Promise<any> {
    if (!url) {
      url = `https://api.openalex.org/works?filter=cites:${openAlexID}`;
    }
    try {
      const response = await Zotero.HTTP.request("GET", url, {
        headers: this.headers,
      });
      const data = JSON.parse(response.responseText);
      return data;
    } catch (error) {
      Zotero.logError(error);
      throw error; // Re-throw to handle it in the calling function
    }
  }
}
