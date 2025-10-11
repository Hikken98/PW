from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine
import schemas, models, crud
from deps import get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aurora Clinic API", version="1.0.0", openapi_url="/openapi.json")

# CORS (sviluppo): permetti tutto per evitare blocchi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

# Patients
@app.post("/api/patients", response_model=schemas.PatientOut, status_code=201)
def create_patient(payload: schemas.PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db, payload)

@app.get("/api/patients", response_model=list[schemas.PatientOut])
def get_patients(db: Session = Depends(get_db)):
    return crud.list_patients(db)

# Doctors
@app.post("/api/doctors", response_model=schemas.DoctorOut, status_code=201)
def create_doctor(payload: schemas.DoctorCreate, db: Session = Depends(get_db)):
    return crud.create_doctor(db, payload)

@app.get("/api/doctors", response_model=list[schemas.DoctorOut])
def get_doctors(db: Session = Depends(get_db)):
    return crud.list_doctors(db)

# Appointments
@app.post("/api/appointments", response_model=schemas.AppointmentOut, status_code=201)
def create_appointment(payload: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_appointment(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@app.get("/api/appointments", response_model=list[schemas.AppointmentOut])
def get_appointments(
    doctor_id: int | None = Query(default=None),
    date: str | None = Query(default=None, description="YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    return crud.list_appointments(db, doctor_id, date)

@app.delete("/api/appointments/{appt_id}", status_code=204)
def delete_appointment(appt_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_appointment(db, appt_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Appointment not found")
