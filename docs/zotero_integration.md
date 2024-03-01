# Adding Zotero CSV Files to Your Project

This project supports analyzing and visualizing reference networks using CSV files exported from Zotero, a free, easy-to-use tool to help you collect, organize, cite, and share research. Follow the steps below to download your Zotero library as a CSV file and add it to this project for further processing.

## Exporting Your Library from Zotero

1. **Open your Zotero application** or log in to your Zotero account via the web interface.
2. **Select the collection** you wish to export. You can export your entire library or any specific collection or tag that you have created within Zotero.
3. **Go to the "File" menu** (in the Zotero desktop application) or click on the gear icon (in the Zotero web interface), and select `Export Library...`.
4. **Choose the CSV format** for the export. Ensure that you check any additional options that you need, such as including notes or files attached to your references.
5. **Save the CSV file** to your computer.

## Adding the CSV File to Your Project

Once you have exported your library or collection from Zotero:

1. **Locate the `data` folder** within your project directory. If it does not exist, create it at the root level of your project.

    Your project structure should look something like this:

    ```
    reference-network/
    │
    ├── config/
    ├── reference_network/
    ├── figures/
    ├── tests/
    ├── data/              # <--- Place your CSV files here
    └── pyproject.toml
    ```

2. **Move or copy the exported CSV file** into the `data` folder. You can do this using your file manager or via a command line interface:

    ```sh
    mv /path/to/your/exported_file.csv /path/to/your_project_root/data/
    ```

    Replace `/path/to/your/exported_file.csv` with the actual path to your downloaded Zotero CSV file and `/path/to/your_project_root/data/` with the path to the `data` folder in your project.

## Using the CSV File in Your Project

With the CSV file now in the `data` folder, you can proceed to use it within your project. The path to the CSV data must be specified in config/data_config.yaml.
