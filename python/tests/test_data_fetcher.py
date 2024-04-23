# If the application fetches publication data from external sources
# (e.g., Google Scholar, PubMed, SemanticScholar, CrossRef), need a dedicated class

#     Attributes: None specific, though could include API keys or rate
#         limiting settings
#     Methods:
#         Methods to fetch data by DOI, title, author, etc.
#         Methods to parse fetched data into Publication objects


def test_data_fetcher_load_csv_exported_file(csv_data_fetcher):
    zotero_data = csv_data_fetcher.load_zotero_exported_file()
    assert zotero_data is not None
    assert len(zotero_data) == 31
    assert "Title" in zotero_data.columns
    assert "DOI" in zotero_data.columns


def test_data_fetcher_fetch_references_by_doi(csv_data_fetcher):
    references = csv_data_fetcher.fetch_references_by_doi(
        "10.1371/journal.pcbi.1009832"
    )
    assert references is not None
    assert len(references) == 60
    assert "DOI" in references[0]
    assert "article-title" in references[0]
    assert "author" in references[0]
    assert "year" in references[0]


def test_data_fetcher_request_rate_limit(csv_data_fetcher):
    delay = csv_data_fetcher.request_rate_limit()
    assert delay is not None
    assert delay > 0
    assert delay < 1
    assert isinstance(delay, float)
