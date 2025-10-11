from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from datetime import timedelta
import models, schemas

# Patients
def create_patient(db: Session, data: schemas.PatientCreate) -> models.Patient:
    obj = models.Patient(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def list_patients(db: Session):
    return db.scalars(select(models.Patient)).all()

# Doctors
def create_doctor(db: Session, data: schemas.DoctorCreate) -> models.Doctor:
    obj = models.Doctor(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

def list_doctors(db: Session):
    return db.scalars(select(models.Doctor)).all()

# Appointments
def _compute_end(start):
    return start + timedelta(minutes=30)

def create_appointment(db: Session, data: schemas.AppointmentCreate) -> models.Appointment:
    start = data.start_time
    end = _compute_end(start)
    # blocca overlap
    existing = db.scalars(select(models.Appointment).where(
        models.Appointment.doctor_id == data.doctor_id,
        and_(models.Appointment.start_time < end,
             models.Appointment.end_time > start)
    )).first()
    if existing:
        raise ValueError("Appointment overlaps for this doctor")

    obj = models.Appointment(
        doctor_id=data.doctor_id, patient_id=data.patient_id,
        start_time=start, end_time=end
    )
    db.add(obj); db.commit(); db.refresh(obj)

    # ⚠️ Assicura che le relation siano caricate e aggiungi i campi calcolati
    _ = obj.doctor, obj.patient  # forza lazy load se necessario
    obj.doctor_name = f"{obj.doctor.last_name} {obj.doctor.first_name}"
    obj.patient_name = f"{obj.patient.last_name} {obj.patient.first_name}"

    return obj


def list_appointments(db: Session, doctor_id: int | None = None, date: str | None = None):
    q = select(models.Appointment)
    if doctor_id:
        q = q.where(models.Appointment.doctor_id == doctor_id)
    if date:
        from datetime import datetime, timedelta
        d = datetime.fromisoformat(date)
        q = q.where(models.Appointment.start_time >= d,
                    models.Appointment.start_time < d + timedelta(days=1))
    q = q.order_by(models.Appointment.start_time)
    results = db.scalars(q).all()

    # aggiunge i nomi leggibili
    for r in results:
        r.doctor_name = f"{r.doctor.last_name} {r.doctor.first_name}"
        r.patient_name = f"{r.patient.last_name} {r.patient.first_name}"
    return results


def delete_appointment(db: Session, appt_id: int) -> bool:
    obj = db.get(models.Appointment, appt_id)
    if not obj:
        return False
    db.delete(obj); db.commit()
    return True

def delete_patient(db: Session, patient_id: int) -> bool:
    obj = db.get(models.Patient, patient_id)
    if not obj: return False
    db.delete(obj); db.commit()
    return True

def delete_doctor(db: Session, doctor_id: int) -> bool:
    obj = db.get(models.Doctor, doctor_id)
    if not obj: return False
    db.delete(obj); db.commit()
    return True

