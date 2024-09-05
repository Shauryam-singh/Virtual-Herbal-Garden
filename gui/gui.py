import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import os
import sys
import json
import random

# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from scripts.classify_plant import classify_plant

# Load plant information from JSON
with open('data/plant_info.json', 'r') as f:
    plant_info = json.load(f)

def generate_questions(plant_info):
    questions = []
    for plant, info in plant_info.items():
        # Create a question about the medicinal uses of the plant
        question = f"What is {plant} known for?"
        options = [info]  # Correct answer
        
        # Add some random options (for example, using the same info for simplicity)
        all_infos = list(plant_info.values())
        random_options = random.sample(all_infos, min(3, len(all_infos)))
        options += random_options
        
        # Shuffle options to make the question more challenging
        random.shuffle(options)
        
        # Create the question entry
        questions.append({"question": question, "options": options, "answer": info})
        
    return questions

# Generate and shuffle questions
quiz_questions = generate_questions(plant_info)
random.shuffle(quiz_questions)  # Shuffle questions

class VirtualHerbalGardenApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Virtual Herbal Garden")
        self.root.geometry("1000x800")  # Set an initial window size
        
        # Create a frame for the layout
        self.main_frame = tk.Frame(root, bg='#e0e0e0')
        self.main_frame.pack(fill='both', expand=True, padx=20, pady=20)
        
        # Configure grid rows and columns to be responsive
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(1, weight=1)
        self.main_frame.grid_rowconfigure(5, weight=1)
        
        # Title Label
        self.title_label = tk.Label(self.main_frame, text="Virtual Herbal Garden", font=('Helvetica', 28, 'bold'), bg='#e0e0e0', fg='#333')
        self.title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20), sticky='n')
        
        # Search Entry and Button
        self.search_entry = tk.Entry(self.main_frame, font=('Helvetica', 16), bd=0, relief='flat', bg='#fff', fg='#333', borderwidth=2)
        self.search_entry.grid(row=1, column=0, pady=10, padx=5, sticky='ew')
        
        self.search_button = tk.Button(self.main_frame, text="Search", command=self.search_plant, font=('Helvetica', 16), bg='#4CAF50', fg='white', relief='flat', padx=10, pady=5, borderwidth=2)
        self.search_button.grid(row=1, column=1, pady=10, padx=5, sticky='ew')
        
        # Upload Image Button
        self.upload_button = tk.Button(self.main_frame, text="Upload Image", command=self.upload_image, font=('Helvetica', 16), bg='#2196F3', fg='white', relief='flat', padx=10, pady=5, borderwidth=2)
        self.upload_button.grid(row=2, column=0, pady=10, padx=5, sticky='ew')
        
        # Clear Button
        self.clear_button = tk.Button(self.main_frame, text="Clear", command=self.clear_results, font=('Helvetica', 16), bg='#f44336', fg='white', relief='flat', padx=10, pady=5, borderwidth=2)
        self.clear_button.grid(row=2, column=1, pady=10, padx=5, sticky='ew')
        
        # Quiz Button
        self.quiz_button = tk.Button(self.main_frame, text="Take Quiz", command=self.start_quiz, font=('Helvetica', 16), bg='#FF5722', fg='white', relief='flat', padx=10, pady=5, borderwidth=2)
        self.quiz_button.grid(row=3, column=0, columnspan=2, pady=10, padx=5, sticky='ew')
        
        # Result Label
        self.result_label = tk.Label(self.main_frame, text="", font=('Helvetica', 18), bg='#e0e0e0', fg='#333', wraplength=750, justify='left')
        self.result_label.grid(row=4, column=0, columnspan=2, pady=10)
        
        # Image Label
        self.image_label = tk.Label(self.main_frame, bg='#e0e0e0')
        self.image_label.grid(row=5, column=0, columnspan=2, pady=10, padx=5, sticky='nsew')
        
        # Status Bar
        self.status_bar = tk.Label(self.main_frame, text="Ready", anchor='w', relief=tk.SUNKEN, height=1, padx=5, bg='#b0bec5', font=('Helvetica', 14))
        self.status_bar.grid(row=6, column=0, columnspan=2, sticky='ew', pady=(10, 0))
        
        # Add padding to buttons and hover effects
        self.upload_button.bind("<Enter>", lambda e: self.upload_button.config(bg='#1976D2'))
        self.upload_button.bind("<Leave>", lambda e: self.upload_button.config(bg='#2196F3'))
        self.clear_button.bind("<Enter>", lambda e: self.clear_button.config(bg='#c62828'))
        self.clear_button.bind("<Leave>", lambda e: self.clear_button.config(bg='#f44336'))
        self.quiz_button.bind("<Enter>", lambda e: self.quiz_button.config(bg='#e64a19'))
        self.quiz_button.bind("<Leave>", lambda e: self.quiz_button.config(bg='#FF5722'))

    def search_plant(self):
        query = self.search_entry.get().lower()
        results = {plant: info for plant, info in plant_info.items() if query in plant.lower() or query in info.lower()}
        
        if results:
            display_text = "\n\n".join([f"{plant.title()}: {info}" for plant, info in results.items()])
        else:
            display_text = "No results found."
        
        self.result_label.config(text=display_text)
        self.image_label.config(image='')
        self.image_label.image = None
        self.status_bar.config(text="Search complete")

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

    def start_quiz(self):
        self.quiz_window = tk.Toplevel(self.root)
        self.quiz_window.title("Plant Knowledge Quiz")
        self.quiz_window.geometry("600x400")
        
        self.current_question = None
        self.score = 0
        self.question_index = 0
        
        self.quiz_frame = tk.Frame(self.quiz_window, bg='#e0e0e0')
        self.quiz_frame.pack(fill='both', expand=True, padx=20, pady=20)
        
        self.question_label = tk.Label(self.quiz_frame, text="", font=('Helvetica', 18), bg='#e0e0e0', fg='#333', wraplength=550, justify='left')
        self.question_label.pack(pady=10)
        
        self.option_var = tk.StringVar(value=-1)  # Initialize with a default value
        
        self.option_buttons = [tk.Radiobutton(self.quiz_frame, text="", variable=self.option_var, value=i, font=('Helvetica', 14), bg='#e0e0e0', anchor='w', padx=10, pady=5) for i in range(4)]
        
        for btn in self.option_buttons:
            btn.pack(anchor='w', padx=10, pady=5)
        
        self.submit_button = tk.Button(self.quiz_frame, text="Submit", command=self.check_answer, font=('Helvetica', 16), bg='#4CAF50', fg='white', relief='flat', padx=10, pady=5)
        self.submit_button.pack(pady=10)
        
        self.load_question()
    
    def load_question(self):
        if self.question_index >= len(quiz_questions):
            self.quiz_window.destroy()
            messagebox.showinfo("Quiz Completed", f"Your score: {self.score}/{len(quiz_questions)}")
            return
        
        self.current_question = quiz_questions[self.question_index]
        self.question_label.config(text=self.current_question["question"])
        
        options = self.current_question["options"]
        random.shuffle(options)
        for i, option in enumerate(options):
            self.option_buttons[i].config(text=option)
        
        self.question_index += 1
    
    def check_answer(self):
        selected_value = self.option_var.get()
        if selected_value == -1:
            messagebox.showwarning("No Selection", "Please select an option.")
            return
        
        selected_option = self.current_question["options"][int(selected_value)]
        correct_answer = self.current_question["answer"]
        
        if selected_option == correct_answer:
            self.score += 1
        
        self.load_question()

if __name__ == "__main__":
    root = tk.Tk()
    app = VirtualHerbalGardenApp(root)
    root.mainloop()
