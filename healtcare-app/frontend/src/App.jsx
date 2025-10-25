import React, { useEffect, useState } from 'react'
import {
  getDoctors, getPatients, getAppointments,
  createAppointment, createPatient, createDoctor,
  deleteAppointment, deletePatient, deleteDoctor
} from './api'
import AppointmentForm from './components/AppointmentForm'
import PatientForm from './components/PatientForm'
import DoctorForm from './components/DoctorForm'
import List from './components/List'

const formatIT = (iso) =>
  new Date(iso).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

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
      if (showAll) setAppts(await getAppointments());         // senza filtri
      else setAppts(await getAppointments({ date, doctor_id: doctorFilter }));
    } catch (err) {
      console.error('reload error:', err);
      setAppts([]);
    }
  }

  useEffect(()=>{ reload() }, [date, doctorFilter, showAll])

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div>
          <h1 className="brand">Aurora – Prenotazioni</h1>
          <div className="subtitle"></div>
        </div>
        <span className="badge mono">v1.0</span>
      </div>

      {/* Toolbar filtri */}
      <div className="toolbar">
        <label>Data
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </label>
        <label>Medico
          <select value={doctorFilter} onChange={e=>setDoctorFilter(e.target.value)}>
            <option value="">Tutti</option>
            {doctors.map(d=>(
              <option key={d.id} value={d.id}>
                {d.last_name} {d.first_name} – {d.specialty}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={showAll} onChange={e=>setShowAll(e.target.checked)} />
          &nbsp;Mostra tutti (ignora filtri)
        </label>
        <button className="btn btn-ghost" onClick={reload}>Aggiorna</button>
      </div>

      {/* GRID 3 colonne + Agenda che span-tutte le colonne */}
      <div className="grid">
        {/* Nuovo appuntamento */}
        <section className="card">
          <h2>Nuovo appuntamento</h2>
          <AppointmentForm
            doctors={doctors}
            patients={patients}
            onCreate={async (data)=>{
              try {
                await createAppointment(data);
                setShowAll(true);   // mostra subito in agenda
                await reload();
              } catch (e) {
                alert(e.message || 'Errore prenotazione');
              }
            }}
          />
        </section>

        {/* Pazienti */}
        <section className="card">
          <h2>Pazienti</h2>
          <PatientForm onCreate={async (p)=>{
            try { await createPatient(p); await reload(); }
            catch(e){ alert(e.message) }
          }} />
          <List
            items={patients}
            columns={["id","last_name","first_name","email", "phone"]}
            onDelete={async (id)=>{
              if(!confirm('Eliminare questo paziente? Verranno rimossi anche i suoi appuntamenti.')) return;
              try { await deletePatient(id); await reload(); }
              catch(e){ alert(e.message) }
            }}
          />
        </section>

        {/* Medici */}
        <section className="card">
          <h2>Medici</h2>
          <DoctorForm onCreate={async (d)=>{
            try { await createDoctor(d); await reload(); }
            catch(e){ alert(e.message) }
          }} />
          <List
            items={doctors}
            columns={["id","last_name","first_name","specialty"]}
            onDelete={async (id)=>{
              if(!confirm('Eliminare questo medico? Verranno rimossi anche i suoi appuntamenti.')) return;
              try { await deleteDoctor(id); await reload(); }
              catch(e){ alert(e.message) }
            }}
          />
        </section>

        {/* Agenda - span su tutte le colonne della grid */}
        <section className="card span-all">
          <h2>Agenda</h2>
          <p style={{opacity:.7}}>Appuntamenti mostrati: {Array.isArray(appts) ? appts.length : 0}</p>
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
                  <td>{formatIT(a.start_time)}</td>
                  <td>
                    <button
                      className="btn btn-ghost"
                      onClick={async()=>{
                        if(!confirm('Eliminare questo appuntamento?')) return;
                        try { await deleteAppointment(a.id); await reload(); }
                        catch(e){ alert(e.message) }
                      }}
                    >
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
