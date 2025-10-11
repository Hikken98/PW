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
      if (showAll) {
        setAppts(await getAppointments()); // senza filtri
      } else {
        setAppts(await getAppointments({date, doctor_id: doctorFilter}));
      }
    } catch (err) {
      console.error('reload error:', err);
      setAppts([]);
    }
  }

  useEffect(()=>{ reload() }, [date, doctorFilter, showAll])

  return (
    <div className="container">
      <h1>Aurora – Prenotazioni</h1>

      <section>
        <h2>Filtri agenda</h2>
        <div className="row">
          <label>Data <input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label>
          <label>Medico
            <select value={doctorFilter} onChange={e=>setDoctorFilter(e.target.value)}>
              <option value="">Tutti</option>
              {doctors.map(d=> <option key={d.id} value={d.id}>{d.last_name} {d.first_name} – {d.specialty}</option>)}
            </select>
          </label>
          <label style={{marginLeft:12}}>
            <input type="checkbox" checked={showAll} onChange={e=>setShowAll(e.target.checked)} />
            {' '}Mostra tutti (ignora filtri)
          </label>
          <button onClick={reload}>Aggiorna</button>
        </div>
      </section>

      <section className="grid">
        <div>
          <h2>Nuovo appuntamento</h2>
          <AppointmentForm
            doctors={doctors}
            patients={patients}
            onCreate={async (data)=>{
              try {
                await createAppointment(data);
                setShowAll(true); // mostra subito in agenda
                await reload();
              } catch (e) {
                alert(e.message || 'Errore prenotazione');
              }
            }}
          />
        </div>
        <div>
          <h2>Pazienti</h2>
          <PatientForm onCreate={async (p)=>{ try { await createPatient(p); await reload(); } catch(e){ alert(e.message) } }} />
          <List items={patients} columns={["id","last_name","first_name","email"]} />
        </div>
        <div>
          <h2>Medici</h2>
          <DoctorForm onCreate={async (d)=>{ try { await createDoctor(d); await reload(); } catch(e){ alert(e.message) } }} />
          <List items={doctors} columns={["id","last_name","first_name","specialty"]} />
        </div>
      </section>

<section>
  <h2>Agenda</h2>
  <p style={{ opacity: .7 }}>Appuntamenti mostrati: {Array.isArray(appts) ? appts.length : 0}</p>
  <table>
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
      {appts.map(a => (
        <tr key={a.id}>
          <td>{a.id}</td>
          <td>{a.doctor_id} – {a.doctor_name}</td>
          <td>{a.patient_id} – {a.patient_name}</td>
          <td>{new Date(a.start_time).toLocaleString()}</td>
          <td>
            <button onClick={async () => {
              await deleteAppointment(a.id);
              await reload();
            }}>Elimina</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>


    </div>
  )
}
