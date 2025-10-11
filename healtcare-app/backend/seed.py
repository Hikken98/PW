from database import Base, engine, SessionLocal
from models import Patient, Doctor

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if not db.query(Doctor).count():
    db.add_all([
        Doctor(first_name="Giulia", last_name="Rossi", specialty="Cardiologia"),
        Doctor(first_name="Marco", last_name="Bianchi", specialty="Dermatologia"),
        Doctor(first_name="Sara", last_name="Verdi", specialty="Ortopedia"),
    ])

if not db.query(Patient).count():
    db.add_all([
        Patient(first_name="Diego", last_name="Taglialegami", email="diego@example.com"),
        Patient(first_name="Anna", last_name="Neri", phone="3330001111"),
    ])

db.commit(); db.close()
print("Seed ok.")
