# Virtual Herbal Garden

## Overview

The **Virtual Herbal Garden** is an interactive, educational, and immersive application designed to showcase the diverse range of medicinal plants used in AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy). The application allows users to explore various plants, learn about their medicinal properties, and understand their significance in traditional medicine systems.

## Features

- **Interactive Exploration:** Users can explore a virtual garden and click on different plants to view detailed information.
- **Educational Content:** Provides in-depth information about each plant's medicinal uses, benefits, and cultural significance.
- **3D Models / AR Integration:** Option to view 3D models of plants or use Augmented Reality to visualize plants in real environments.
- **Search and Filter:** Easily search and filter plants based on various criteria.
- **Image Upload and Classification:** Upload images of plants to classify them and retrieve detailed information.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/shauryam-singh/virtual-herbal-garden.git
   cd virtual-herbal-garden
   ```

2. **Set Up a Virtual Environment:**
    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

3. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Set Up the Database:**
    ```bash
    python create_database.py
    ```
## Usage

1. **Run the Application:**
    ```bash
    python main.py
    ```

2. **Navigate the Application:**

- **Explore the Virtual Garden:** Click on different plants to view detailed information.
- **Upload and Classify Images:** Use the upload button to classify images of plants and get information.

## Requirements File (requirements.txt)
Ensure your requirements.txt includes the necessary packages. For example:
    ```bash
    tkinter
    Pillow
    sqlite3
    ```
## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any questions or feedback, please contact:

**Your Name** - shauryamsingh9@gmail.com
**Project Repository** - https://github.com/shauryam-singh/virtual-herbal-garden