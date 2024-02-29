import yaml
from pydantic import BaseModel, Field


class DataConfig(BaseModel):
    data_path: str
    zotero_api_key: str
    library_id: str
    semantic_scholar_api_key: str

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
    edge_line: dict = Field(default_factory=lambda: {"width": 0.5, "color": "#888"})
    node_marker: dict = Field(
        default_factory=lambda: {
            "showscale": True,
            "colorscale": "YlGnBu",
            "color": [],
            "size": 10,
        }
    )
    layout: dict = Field(
        default_factory=lambda: {
            "showlegend": False,
            "hovermode": "closest",
            "margin": {"b": 0, "l": 0, "r": 0, "t": 0},
        }
    )

    image_path: str = "output/reference_graph.gv"

    @classmethod
    def from_yaml(cls, file_path: str):
        with open(file_path, "r") as file:
            config = yaml.safe_load(file)
        return cls(**config)

    def to_yaml(self, file_path: str):
        with open(file_path, "w") as file:
            yaml.dump(self.model_dump(), file)


PLOT_CONFIG = PlotConfig.from_yaml("config/plot_config.yaml")
