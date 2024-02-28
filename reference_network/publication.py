class Publication:
    def __init__(self, title, authors, year, doi, references):
        self.title = title
        self.authors = authors
        self.year = year
        self.doi = doi
        self.references = references

    def add_reference(self, reference):
        self.references.append(reference)
