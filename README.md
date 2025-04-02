# Tenzor_sid_ver
This is a basic version of tensor that I have created.
Installation and Setup Instructions

Welcome to the GitHub repository for our LinkedIn Chrome Extension! Follow these steps to get the project up and running on your local machine.
Prerequisites

Before you begin, ensure you have Python installed on your system. You can download Python from python.org. This project also requires Google Chrome to use the extension functionality.
Step 1: Clone the Repository

First, clone the repository to your local machine:

git clone https://github.com/yourusername/yourprojectname.git
cd yourprojectname

Step 2: Set Up Python Environment

It's recommended to use a virtual environment for Python projects to avoid conflicts with other package versions. You can set up a virtual environment by running:

python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

Step 3: Install Dependencies

Install the project dependencies by running:

pip install -r requirements.txt

Step 4: Run the Backend

Activate the Flask server to handle backend processes:

python getdata.py

Ensure that the server is running without errors before proceeding.
Step 5: Load the Chrome Extension

    Open Google Chrome and navigate to chrome://extensions/.

    Enable Developer Mode by toggling the switch in the upper right corner.

    Click the "Load unpacked" button and select the frontend folder from the cloned repository. This will install the Chrome extension locally.

Step 6: Use the Extension on LinkedIn

Once the extension is loaded, navigate to LinkedIn and begin using the extension freely.
Troubleshooting

If you encounter any issues during the installation or while using the extension, please check the following:

    Ensure all commands are executed in the project root directory.

    Verify that your Python environment is active when running scripts.

    Check the Flask server log for any error messages that might indicate what went wrong.
