import yaml
from pydantic import BaseModel, Field


class DataConfig(BaseModel):
    data_path: str
    zotero_api_key: str
    library_id: str

    @classmethod
    def from_yaml(cls, file_path: str):
        with open(file_path, "r") as file:
            config = yaml.safe_load(file)
        return cls(**config)

    def to_yaml(self, file_path: str):
        with open(file_path, "w") as file:
            yaml.dump(self.model_dump(), file)


DATA_CONFIG = DataConfig.from_yaml("config/data_config.yaml")


class PlotConfig(BaseModel):
    base_size: int = 10
    scaling_factor: int = 2

    interactive_graph_path: str = "figures/interactive_graph.html"
    static_graph_path: str = "figures/reference_graph.gv"

    @classmethod
    def from_yaml(cls, file_path: str):
        with open(file_path, "r") as file:
            config = yaml.safe_load(file)
        return cls(**config)

    def to_yaml(self, file_path: str):
        with open(file_path, "w") as file:
            yaml.dump(self.model_dump(), file)


PLOT_CONFIG = PlotConfig.from_yaml("config/plot_config.yaml")
