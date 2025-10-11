from pydantic import BaseModel, EmailStr
from datetime import datetime

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    tax_code: str | None = None
    phone: str | None = None
    email: EmailStr | None = None

class PatientCreate(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    class Config:
        from_attributes = True

class DoctorBase(BaseModel):
    first_name: str
    last_name: str
    specialty: str

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(DoctorBase):
    id: int
    class Config:
        from_attributes = True

class AppointmentCreate(BaseModel):
    doctor_id: int
    patient_id: int
    start_time: datetime

class AppointmentOut(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    start_time: datetime
    doctor_name: str
    patient_name: str

    class Config:
        from_attributes = True

