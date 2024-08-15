# Food Allergen Classification Project


## Overview

This repository contains a Convolutional Neural Network (CNN) based model developed to classify food items into 30 allergen groups. The model is entirely hard-coded and built from scratch for an academic project. The project also includes a React frontend to interact with the model via a Flask backend API.

## Features

- **Custom CNN Model:** A model created from scratch to classify food items into 30 different allergen groups.
- **Training Script:** `food_allergen_training.py` to train the model.
- **Prediction Script:** `predict.py` for running predictions with the trained model.
- **Frontend:** A React application for user interaction.
- **Backend:** A Flask API to serve the model and handle requests.

## Installation

### Backend (Flask)

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Create a virtual environment and activate it:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the required Python packages:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the Flask backend:**

    ```bash
    python src/predict.py
    ```

### Frontend (React)

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install the required npm packages:**

    ```bash
    npm install
    ```

3. **Start the React application:**

    ```bash
    npm start
    ```

## Usage

1. **Ensure the Flask backend is running.**

2. **Start the React frontend.**

3. **Interact with the frontend to upload images or use the real-time camera functionality. The frontend communicates with the Flask backend to get predictions from the model.**



## Dataset

The dataset used for this project contains some copyrighted material whose use has not been specifically authorized by the copyright owners. In an effort to advance scientific research, we make this material available for academic research. If you wish to use copyrighted material in our dataset for purposes beyond non-commercial research and academic purposes, you must obtain permission directly from the copyright owner. We believe this constitutes a 'fair use' of any such copyrighted material as provided for in section 107 of the US Copyright Law. In accordance with Title 17 U.S.C. Section 107, the material on this site is distributed without profit to those who have expressed a prior interest in receiving the included information for non-commercial research and educational purposes. (Adapted from Christopher Thomas).

### Citation

If you find our dataset useful, please cite it as follows:

```bibtex
@article{mishra2022allergen30,
  title={Allergen30: Detecting Food Items with Possible Allergens Using Deep Learning-Based Computer Vision},
  author={Mishra, Mayank and Sarkar, Tanmay and Choudhury, Tanupriya and Bansal, Nikunj and Smaoui, Slim and Rebezov, Maksim and Shariati, Mohammad Ali and Lorenzo, Jose Manuel},
  journal={Food Analytical Methods},
  pages={1--34},
  year={2022},
  publisher={Springer}
}



