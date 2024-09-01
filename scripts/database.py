import sqlite3

def create_database():
    conn = sqlite3.connect('data/plants.db')
    cursor = conn.cursor()
    
    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS plants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            info TEXT
        )
    ''')
    
    # Insert plant data
    plants = [
        ('rose', 'Used for skin care and in cosmetics.'),
        ('tulsi', 'Used in Ayurveda for its medicinal properties.'),
        ('aloevera', 'Known for its soothing and healing properties.'),
        ('lavender', 'Used in aromatherapy for relaxation and sleep improvement.'),
        ('mint', 'Commonly used to aid digestion and relieve headaches.'),
        ('chamomile', 'Used to promote relaxation and help with sleep.'),
        ('dandelion', 'Used as a diuretic and to aid digestion.'),
        ('ginger', 'Known for its anti-nausea and anti-inflammatory properties.'),
        ('turmeric', 'Contains curcumin, which has anti-inflammatory and antioxidant effects.'),
        ('basil', 'Used in cooking and has antibacterial properties.'),
        ('parsley', 'Rich in vitamins and used for its diuretic properties.'),
        ('thyme', 'Has antimicrobial properties and is used in cooking and medicine.'),
        ('rosemary', 'Used to improve memory and concentration, and for its antioxidant properties.'),
        ('sage', 'Known for its digestive benefits and antimicrobial properties.'),
        ('oregano', 'Contains antioxidants and is used for its anti-inflammatory effects.'),
        ('coriander', 'Used for its antioxidant and digestive benefits.'),
        ('fennel', 'Known for its digestive benefits and ability to reduce bloating.'),
        ('jasmine', 'Used in aromatherapy for its calming effects and to reduce stress.'),
        ('hibiscus', 'Rich in antioxidants and used to lower blood pressure.'),
        ('echinacea', 'Boosts the immune system and is used to prevent colds.'),
    ]
    
    # Insert data into the table
    cursor.executemany("INSERT INTO plants (name, info) VALUES (?, ?)", plants)
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_database()
