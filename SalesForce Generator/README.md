___Generator Script___

### Generates a JSON file from the csv for the extension.

## Windows
1. Install python 2.7 https://www.python.org/downloads/release/python-2710/
2. Move the new csv with cert information into this folder and name it "BuiltInCAs.csv"
3. Navigate to the current folder and run generate.sh by double clicking 
4. Copy the SalesForceData.js generated in this folder into the ../addon/lib folder overwritting the old one.

## Anywhere Else
1. Install python 2.7 https://www.python.org/downloads/release/python-2710/
2. Move the new csv with cert information into this folder and name it "BuiltInCAs.csv"
3. Open a command prompt and navigate to the folder using ls to view files/folders in the current folder and cd <foldername> to go into a folder.
4. Run generator using the command "python generator.py" from your terminal
5. Copy the SalesForceData.js generated in this folder into the ../addon/lib folder overwritting the old one.
