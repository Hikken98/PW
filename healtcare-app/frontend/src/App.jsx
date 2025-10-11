import React, { useEffect, useState } from 'react'
import { getDoctors, getPatients, getAppointments, createAppointment, createPatient, createDoctor, deleteAppointment } from './api'
import AppointmentForm from './components/AppointmentForm'
import PatientForm from './components/PatientForm'
import DoctorForm from './components/DoctorForm'
import List from './components/List'

export default function App(){
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [appts, setAppts] = useState([])
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [doctorFilter, setDoctorFilter] = useState('')
  const [showAll, setShowAll] = useState(false)

  const reload = async ()=>{
    try {
      setDoctors(await getDoctors());
      setPatients(await getPatients());
      if (showAll) setAppts(await getAppointments());
      else setAppts(await getAppointments({date, doctor_id: doctorFilter}));
    } catch (err) { console.error('reload error:', err); setAppts([]); }
  }
  useEffect(()=>{ reload() }, [date, doctorFilter, showAll])

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="brand">Aurora – Prenotazioni</h1>
          <div className="subtitle">MVP gestionale clinica • React + FastAPI</div>
        </div>
        <span className="badge mono">v1.0</span>
      </div>

      <div className="toolbar">
        <label>Data <input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
        <label>Medico
          <select value={doctorFilter} onChange={e=>setDoctorFilter(e.target.value)}>
            <option value="">Tutti</option>
            {doctors.map(d=> <option key={d.id} value={d.id}>{d.last_name} {d.first_name} – {d.specialty}</option>)}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={showAll} onChange={e=>setShowAll(e.target.checked)} />
          &nbsp;Mostra tutti (ignora filtri)
        </label>
        <button className="btn btn-ghost" onClick={reload}>Aggiorna</button>
      </div>

      <div className="grid">
        <section className="card">
          <h2>Nuovo appuntamento</h2>
          <AppointmentForm
            doctors={doctors}
            patients={patients}
            onCreate={async (data)=>{
              try{ await createAppointment(data); setShowAll(true); await reload(); }
              catch(e){ alert(e.message || 'Errore prenotazione') }
            }}
          />
        </section>

        <section className="card">
          <h2>Pazienti</h2>
          <PatientForm onCreate={async (p)=>{ try{ await createPatient(p); await reload(); } catch(e){ alert(e.message) } }} />
          <List items={patients} columns={["id","last_name","first_name","email"]} />
        </section>

        <section className="card">
          <h2>Medici</h2>
          <DoctorForm onCreate={async (d)=>{ try{ await createDoctor(d); await reload(); } catch(e){ alert(e.message) } }} />
          <List items={doctors} columns={["id","last_name","first_name","specialty"]} />
        </section>
      </div>

      <section className="card" style={{marginTop:18}}>
        <h2>Agenda</h2>
        <p style={{opacity:.7}}>Appuntamenti mostrati: {Array.isArray(appts) ? appts.length : 0}</p>
        {/* Qui usi la tua tabella custom con nomi/id oppure List se preferisci */}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medico</th>
              <th>Paziente</th>
              <th>Data / Ora</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(appts||[]).map(a=>(
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.doctor_id} – {a.doctor_name}</td>
                <td>{a.patient_id} – {a.patient_name}</td>
                <td>{new Date(a.start_time).toLocaleString()}</td>
                <td><button className="btn btn-ghost" onClick={async()=>{ await deleteAppointment(a.id); await reload(); }}>Elimina</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
