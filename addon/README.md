# Getting Started For Developers
Updated: 4/24/2016

## Installing Node.js
* Go to https://nodejs.org/en/
* Download the latest stable release of Node.js
* Follow the installation prompts and install the program

## Linux Users: Installing NPM
* NPM does not come standard with Node.js in Linux.
* Run command - sudo apt-get install NPM - on Ubuntu
    + Other distrobutions may install using their package manager in a similar manner

## Installing jpm
* In the command prompt, run this command to install jpm globally

        npm install jpm ­­--global

    + Alternatively in the command prompt, navigate to the addon folder where the package.json is and run this command to install jpm locally

            npm install

    + Then run this command to add jpm to your path

            export PATH="$HOME/node_modules/.bin/:$PATH"

* In the command prompt, test your installation by running the command
        
        jpm

+ You should see a screen of the available jpm commands

## Setting Preferred Firefox Version
* In the command prompt, run the command

        setx JPM_FIREFOX_BINARY “path/to/your/firefox.exe

    + This is necessary for jpm to run without using the “­b” argument

## Linux Users: Setting Preferred Firefox Version
* Navigate to your specific terminal's load file on startup
* Create a path that links NPM_FIREFOX_BINARY to your Firefox executable

## Cloning The Official Repository
* Download and install Git from https://git­scm.com/
* In the command prompt, navigate to the location where you would like to store the repository files
* Run the command

        git clone https://github.com/sidstamm/FirefoxCertificateManager.git

## Development
* You may modify the addon files using your preferred text editing application such as “Sublime” or “Emacs” or an IDE such as “Eclipse” or “Intellij”

## Generator Script

The generator script is used for updating builtin certificates' information for display by the addon. This generator should be ran whenever a new XPI is packaged. Given a file describing the CA certificates in Mozilla's CA program, the generator generates a JSON file for use by the extension.

#### Running The Generator Script:
* Install [Python 2.7](https://www.python.org/downloads/release/python-2711/)
* Save the new [included CA certificate report](https://mozillacaprogram.secure.force.com/CA/IncludedCACertificateReportCSVFormat) as `BuiltInCAs.csv` in this folder
* On Windows, navigate to this folder and run `generate.sh` by double clicking 
     + On other platforms, use a terminal to navigate to this folder and run `python generator.py`
* Copy the resulting `SalesForceData.js` file generated in this folder into the `../addon/lib` folder (overwritting the old one)
* The next time that the XPI is created it will have the newest certificate data

## Running Your Addon
* In the command prompt, navigate to the location of the addon’s “package.json” file
* If you set the JPM_FIREFOX_BINARY environment variable run the command

        jpm run

* If you did not set the JPM_FIREFOX_BINARY environment variable then you will need to run the command 

        jpm run -b "C:\\path\to\firefox.exe"

    + See the "Setting Preferred Firefox Version" section above for instructions on how to set te JPM_FIREFOX_BINARY variable

* The Firefox browser will launch and after a few seconds the extension will appear in the top bar and you may launch it

## Creating An XPI
* In the command prompt, navigate to the location of the addon’s “package.json” file
* Run the command

        jpm xpi

## Sideloading XPI In Firefox
* Navigate to about:config in Firefox
* Click to continue when prompted with a warning
* Search for

         xpinstall.signatures.required
* Set this value to "false"
* Drag the xpi file on top of the Firefox window to install the XPI


## Submitting The XPI To The Addon Store
* TODO
