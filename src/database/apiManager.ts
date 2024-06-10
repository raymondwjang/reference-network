export class ApiManager {
  private apiUrl: string = "https://api.openalex.org/works/";
  private userAgent: string;

  constructor(apiUrl: string, userAgent: string) {
    this.apiUrl = apiUrl;
    this.userAgent = userAgent;
  }

  async fetchData(doi: string): Promise<any> {
    const url = this.apiUrl + `https://doi.org/${encodeURIComponent(doi)}`;
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
}
