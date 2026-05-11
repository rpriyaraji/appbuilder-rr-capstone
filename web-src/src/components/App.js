import React, { useState, useEffect } from 'react'

const ADOBE_RED = '#e03000'

const styles = {
  container: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    maxWidth: '960px',
    margin: '0 auto',
    padding: '0 24px 40px'
  },
  header: {
    background: ADOBE_RED,
    color: '#fff',
    padding: '20px 24px',
    marginBottom: '32px',
    borderRadius: '0 0 4px 4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '0.5px'
  },
  headerBadge: {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 600
  },
  card: {
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    marginTop: 0,
    marginBottom: '18px'
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'flex-end'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 160px'
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#555',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  },
  input: {
    padding: '8px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none'
  },
  addButton: {
    padding: '8px 22px',
    background: ADOBE_RED,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-end',
    height: '36px',
    whiteSpace: 'nowrap'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    background: ADOBE_RED,
    color: '#fff',
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '13px'
  },
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #eee',
    color: '#333',
    verticalAlign: 'middle'
  },
  trEven: { background: '#fafafa' },
  trOdd: { background: '#fff' },
  badge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    background: '#fde8e3',
    color: ADOBE_RED
  },
  statusBar: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '10px'
  },
  error: {
    color: '#b00',
    background: '#fff0f0',
    border: '1px solid #f5c0c0',
    borderRadius: '4px',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '16px'
  },
  avatarBtn: {
    padding: '4px 10px',
    background: '#fff',
    color: ADOBE_RED,
    border: `1px solid ${ADOBE_RED}`,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  avatarBtnLoading: {
    padding: '4px 10px',
    background: '#fde8e3',
    color: '#aaa',
    border: '1px solid #ecc',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'not-allowed',
    whiteSpace: 'nowrap'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `2px solid ${ADOBE_RED}`,
    display: 'block'
  },
  avatarModal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  avatarModalBox: {
    background: '#fff',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '420px',
    width: '90%',
    textAlign: 'center'
  },
  avatarModalImg: {
    width: '100%',
    borderRadius: '8px',
    marginBottom: '12px',
    border: `3px solid ${ADOBE_RED}`
  },
  avatarModalName: {
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '4px'
  },
  avatarModalRole: {
    color: '#777',
    fontSize: '13px',
    marginBottom: '16px'
  },
  closeBtn: {
    padding: '8px 20px',
    background: ADOBE_RED,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600
  }
}

const EMPTY_FORM = { name: '', role: '', department: '' }

function App () {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState({})   // { empId: true }
  const [avatars, setAvatars] = useState({})          // { empId: imageUrl }
  const [modal, setModal] = useState(null)            // { emp, imageUrl }

  useEffect(() => {
    fetch('/api/v1/web/appbuilder-rr-capstone/generic')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        const raw = Array.isArray(data) ? data : (data.employees || data.data || [])
        setEmployees(raw.map(e => ({ ...e, department: e.department || e.dept || '' })))
        setLoading(false)
      })
      .catch(err => {
        setError(`Could not load initial data: ${err.message}`)
        setLoading(false)
      })
  }, [])

  function handleChange (e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleAdd (e) {
    e.preventDefault()
    const { name, role, department } = form
    if (!name.trim() || !role.trim() || !department.trim()) return
    const payload = { name: name.trim(), role: role.trim(), department: department.trim() }
    setForm(EMPTY_FORM)
    fetch('/api/v1/web/appbuilder-rr-capstone/generic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => setEmployees(prev => [...prev, data.employee || { id: Date.now(), ...payload }]))
      .catch(() => setEmployees(prev => [...prev, { id: Date.now(), ...payload }]))
  }

  function handleGenerateAvatar (emp) {
    const key = emp.id || emp.name
    if (generating[key]) return
    setGenerating(prev => ({ ...prev, [key]: true }))

    const prompt = `professional corporate headshot of a ${emp.role} working in ${emp.department} department, clean white background, business attire, photorealistic`

    fetch('/api/v1/web/appbuilder-rr-capstone/firefly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
      .then(res => res.json())
      .then(data => {
        if (data.imageUrl) {
          setAvatars(prev => ({ ...prev, [key]: data.imageUrl }))
          setModal({ emp, imageUrl: data.imageUrl })
        } else {
          setError(`Firefly error: ${data.error || 'no image returned'}`)
        }
      })
      .catch(err => setError(`Avatar generation failed: ${err.message}`))
      .finally(() => setGenerating(prev => ({ ...prev, [key]: false })))
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Employee Directory</h1>
        <span style={styles.headerBadge}>Powered by Adobe Firefly</span>
      </div>

      <div style={styles.container}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Add Employee</h2>
          <form onSubmit={handleAdd}>
            <div style={styles.formRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Name</label>
                <input style={styles.input} name='name' value={form.name} onChange={handleChange} placeholder='Full name' />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Role</label>
                <input style={styles.input} name='role' value={form.role} onChange={handleChange} placeholder='e.g. Engineer' />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Department</label>
                <input style={styles.input} name='department' value={form.department} onChange={handleChange} placeholder='e.g. Engineering' />
              </div>
              <button type='submit' style={styles.addButton}>Add</button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Employees</h2>
          <div style={styles.statusBar}>
            {loading ? 'Loading...' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} — click "Generate Avatar" to create an AI headshot with Adobe Firefly`}
          </div>
          {!loading && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Avatar</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>AI Avatar</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...styles.td, color: '#aaa', textAlign: 'center' }}>
                      No employees yet. Add one above.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp, i) => {
                    const key = emp.id || emp.name
                    const isGenerating = generating[key]
                    const avatarUrl = avatars[key]
                    return (
                      <tr key={key} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={styles.td}>{i + 1}</td>
                        <td style={styles.td}>
                          {avatarUrl
                            ? <img src={avatarUrl} alt={emp.name} style={styles.avatar} onClick={() => setModal({ emp, imageUrl: avatarUrl })} title='Click to enlarge' />
                            : <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#ccc' }}>👤</div>
                          }
                        </td>
                        <td style={styles.td}>{emp.name}</td>
                        <td style={styles.td}><span style={styles.badge}>{emp.role}</span></td>
                        <td style={styles.td}>{emp.department}</td>
                        <td style={styles.td}>
                          <button
                            style={isGenerating ? styles.avatarBtnLoading : styles.avatarBtn}
                            onClick={() => handleGenerateAvatar(emp)}
                            disabled={isGenerating}
                          >
                            {isGenerating ? 'Generating…' : avatarUrl ? 'Regenerate' : 'Generate Avatar'}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div style={styles.avatarModal} onClick={() => setModal(null)}>
          <div style={styles.avatarModalBox} onClick={e => e.stopPropagation()}>
            <img src={modal.imageUrl} alt={modal.emp.name} style={styles.avatarModalImg} />
            <div style={styles.avatarModalName}>{modal.emp.name}</div>
            <div style={styles.avatarModalRole}>{modal.emp.role} · {modal.emp.department}</div>
            <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>Generated by Adobe Firefly</p>
            <button style={styles.closeBtn} onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
