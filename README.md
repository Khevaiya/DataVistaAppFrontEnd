# DataVista APP

## Overview
This project consists of a *Python (FastAPI) backend* and a *React frontend*. The application allows users to upload a CSV file, store it in a database and local folder , process it based on user prompts, and generate a graph based on the results.

## Features
1. *CSV Upload* - Users can upload a CSV file via the frontend.
2. *Database Storage* - The uploaded file is stored in a database and in local file system in the backend.
3. *Prompt Processing* - Users provide prompts to analyze the stored data.
4. *Result Generation* - The system processes the prompts and returns results.
5. *Graph Generation* - Users can generate visual representations of the results by providing graph generation prompt .

## Tech Stack
- *Backend:* Python (FastAPI), PostgreSQL 
- *Frontend:* React.js
- *Database:* PostgreSQL 
- *Deployment:* Docker, Azure Kubernetes Service (AKS)

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js & npm/yarn
- PostgreSQL 

### Frontend Setup
1. Clone the repository:
   git clone https://github.com/khevaiya/DataVistaAppFrontEnd.git
   
2. Navigate to the frontend directory:
   cd ../chata
   
3. Install dependencies:
   npm install  
   
4. Start the React development server:
   npm run dev
   

## API Endpoints
### Upload CSV
- *Endpoint:* POST /upload-csv/
- *Description:* Accepts a CSV file and stores it in the database.

### Get Prompt Result
- *Endpoint:* POST /prompt/
- *Description:* Accepts user input and processes the stored data accordingly.

### Generate Graph
- *Endpoint:* POST /prompt/getGraphBytes/
- *Description:* Generates a graphical representation based on the processed results.

## Usage
1. Open the frontend in your browser (http://localhost:5173).
2. Click the *Upload CSV* button and select a CSV file.
3. After successful upload, enter a *prompt* to analyze the data.
4. View the result of the processed prompt.
5. Enter a *prompt* to analyze the data.Click the *Generate Graph* button to visualize the result.

## Author
[Khevaiya Ghode](https://github.com/khevaiya)
