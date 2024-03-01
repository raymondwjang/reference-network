from reference_network import Publication, PublicationDatabase


def test_data_parser_transform_row_to_publication(csv_data_fetcher, data_parser):
    zotero_data = csv_data_fetcher.load_zotero_exported_file()
    publication = data_parser.transform_row_to_publication(zotero_data.iloc[0])
    assert isinstance(publication, Publication)


def test_data_parser_transform_df_to_publication_database(
    csv_data_fetcher, data_parser
):
    zotero_data = csv_data_fetcher.load_zotero_exported_file()
    publication_database = data_parser.transform_df_to_publication_database(zotero_data)
    assert isinstance(publication_database, PublicationDatabase)
    assert len(publication_database.publications) == 29
    assert isinstance(publication_database.publications[0], Publication)


def test_data_parser_crossref_data_into_publication(
    sample_publication, csv_data_fetcher, data_parser
):
    references = csv_data_fetcher.fetch_references_by_doi(
        "10.1371/journal.pcbi.1009832"
    )
    publication = data_parser.crossref_data_into_publication(
        sample_publication, references
    )
    assert isinstance(publication, Publication)
    assert len(publication.references) == 50


def test_data_parser_populate_references(
    real_publication_database, csv_data_fetcher, data_parser
):
    delay_between_requests = csv_data_fetcher.request_rate_limit()
    database = data_parser.populate_references(
        real_publication_database, csv_data_fetcher, delay_between_requests
    )
    assert isinstance(database, PublicationDatabase)
    assert len(database.publications) == 29
