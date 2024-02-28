from reference_network.ingestor import Ingestor


def test_ingestor():
    ingestor = Ingestor()
    assert ingestor is not None
    assert ingestor.get_data() is not None
    assert ingestor.get_data().shape[0] > 0
    assert ingestor.get_data().shape[1] > 0
    assert ingestor.get_data().shape[1] == 3
    assert ingestor.get_data().columns[0] == "source"
    assert ingestor.get_data().columns[1] == "target"
    assert ingestor.get_data().columns[2] == "weight"
    assert ingestor.get_data().dtypes[0] == "object"
    assert ingestor.get_data().dtypes[1] == "object"
    assert ingestor.get_data().dtypes[2] == "float64"
    assert ingestor.get_data().isnull().values.any() == False
    assert ingestor.get_data().isna().values.any() == False
    assert ingestor.get_data().isnull().sum().sum() == 0
    assert ingestor.get_data().isna().sum().sum() == 0
