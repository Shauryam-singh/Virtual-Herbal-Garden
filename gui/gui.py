import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import os
import sys

# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from scripts.classify_plant import classify_plant

class VirtualHerbalGardenApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Virtual Herbal Garden")
        self.root.geometry("800x600")  # Set an initial window size
        
        # Create a frame for the layout
        self.main_frame = tk.Frame(root, bg='#f9f9f9')
        self.main_frame.pack(fill='both', expand=True, padx=20, pady=20)
        
        # Configure grid rows and columns to be responsive
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(1, weight=1)
        self.main_frame.grid_rowconfigure(3, weight=1)
        
        # Title Label
        self.title_label = tk.Label(self.main_frame, text="Virtual Herbal Garden", font=('Helvetica', 24, 'bold'), bg='#f9f9f9')
        self.title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20), sticky='n')
        
        # Upload Image Button
        self.upload_button = tk.Button(self.main_frame, text="Upload Image", command=self.upload_image, font=('Helvetica', 14), bg='#4CAF50', fg='white', relief='flat', padx=10, pady=5)
        self.upload_button.grid(row=1, column=0, pady=10, padx=5, sticky='ew')
        
        # Clear Button
        self.clear_button = tk.Button(self.main_frame, text="Clear", command=self.clear_results, font=('Helvetica', 14), bg='#f44336', fg='white', relief='flat', padx=10, pady=5)
        self.clear_button.grid(row=1, column=1, pady=10, padx=5, sticky='ew')
        
        # Result Label
        self.result_label = tk.Label(self.main_frame, text="", font=('Helvetica', 16), bg='#f9f9f9', wraplength=750, justify='left')
        self.result_label.grid(row=2, column=0, columnspan=2, pady=10)
        
        # Image Label
        self.image_label = tk.Label(self.main_frame, bg='#f9f9f9')
        self.image_label.grid(row=3, column=0, columnspan=2, pady=10, padx=5, sticky='nsew')
        
        # Status Bar
        self.status_bar = tk.Label(self.main_frame, text="Ready", anchor='w', relief=tk.SUNKEN, height=1, padx=5, bg='#e0e0e0', font=('Helvetica', 12))
        self.status_bar.grid(row=4, column=0, columnspan=2, sticky='ew', pady=(10, 0))
        
        # Add padding to buttons and hover effects
        self.upload_button.bind("<Enter>", lambda e: self.upload_button.config(bg='#45a049'))
        self.upload_button.bind("<Leave>", lambda e: self.upload_button.config(bg='#4CAF50'))
        self.clear_button.bind("<Enter>", lambda e: self.clear_button.config(bg='#e63946'))
        self.clear_button.bind("<Leave>", lambda e: self.clear_button.config(bg='#f44336'))

    def upload_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.jpg *.jpeg *.png")])
        if not file_path:
            return
        
        self.status_bar.config(text="Processing...")
        self.root.update_idletasks()  # Update the GUI to show the status immediately
        
        try:
            plant_name, info = classify_plant(file_path)
            if plant_name is None:
                raise ValueError("Unable to classify the plant.")
            
            self.result_label.config(text=f'Plant: {plant_name}\nInformation: {info}')
            image = Image.open(file_path)
            image = image.resize((600, 400))  # Adjusted size to fit better
            image = ImageTk.PhotoImage(image)
            
            self.image_label.config(image=image)
            self.image_label.image = image
            
            self.status_bar.config(text="Processing complete")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")
            self.status_bar.config(text="Error occurred")
    
    def clear_results(self):
        self.result_label.config(text="")
        self.image_label.config(image='')
        self.image_label.image = None
        self.status_bar.config(text="Ready")

if __name__ == "__main__":
    root = tk.Tk()
    app = VirtualHerbalGardenApp(root)
    root.mainloop()
