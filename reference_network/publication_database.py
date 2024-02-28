from reference_network.publication import Publication


class PublicationDatabase:
    def __init__(self):
        self.publications = []

    def add_publication(self, publication):
        self.publications.append(publication)

    def remove_publication(self, publication):
        self.publications.remove(publication)

    def search_by_year(self, year):
        return [pub for pub in self.publications if pub.year == year]

    def search_by_author(self, author):
        return [pub for pub in self.publications if author in pub.authors]

    def save_to_file(self, filename):
        with open(filename, "w") as file:
            for pub in self.publications:
                file.write(pub.to_string() + "\n")

    def load_from_file(self, filename):
        with open(filename, "r") as file:
            for line in file:
                self.publications.append(Publication.from_string(line.strip()))
