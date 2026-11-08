import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Users, Search, Plus, Pencil, Trash2, X, RefreshCw, BookOpen, AlertCircle } from "lucide-react";
import api from "./api";

const emptyForm = { name: "", email: "", course: "", semester: "1" };

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadStudents() {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/students");
      setStudents(data.students);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load students. Check that the backend and MongoDB are running.");
    } finally { setLoading(false); }
  }
  useEffect(() => { loadStudents(); }, []);

  const filtered = useMemo(() => students.filter(s =>
    [s.name, s.email, s.course].some(v => v.toLowerCase().includes(search.toLowerCase()))
  ), [students, search]);

  function openCreate() { setEditing(null); setForm(emptyForm); setError(""); setModal(true); }
  function openEdit(student) {
    setEditing(student); setForm({ name: student.name, email: student.email, course: student.course, semester: String(student.semester) });
    setError(""); setModal(true);
  }
  function closeModal() { setModal(false); setEditing(null); setForm(emptyForm); setError(""); }

  async function submit(e) {
    e.preventDefault(); setSaving(true); setError("");
    const payload = { ...form, semester: Number(form.semester) };
    try {
      if (editing) {
        await api.put(`/students/${editing._id}`, payload);
        setNotice("Student updated successfully.");
      } else {
        await api.post("/students", payload);
        setNotice("Student added successfully.");
      }
      closeModal(); await loadStudents();
      setTimeout(() => setNotice(""), 3000);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.details?.join(", ") || data?.message || "Something went wrong.");
    } finally { setSaving(false); }
  }

  async function removeStudent(student) {
    if (!window.confirm(`Delete ${student.name}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/students/${student._id}`);
      setNotice("Student deleted successfully.");
      await loadStudents();
      setTimeout(() => setNotice(""), 3000);
    } catch (err) { setError(err.response?.data?.message || "Unable to delete student."); }
  }

  return <div className="min-h-screen">
    <header className="topbar">
      <div className="container nav-inner">
        <a className="brand" href="#"><span className="brand-icon"><GraduationCap size={22}/></span><span>Student<span className="brand-accent">Hub</span></span></a>
        <span className="project-label">DECODELABS · PROJECT 03</span>
      </div>
    </header>

    <main className="container main">
      <section className="hero">
        <div><p className="eyebrow">DATABASE INTEGRATION</p><h1>Student Management</h1><p className="subheading">Manage student records with persistent MongoDB storage.</p></div>
        <button className="primary-btn" onClick={openCreate}><Plus size={18}/> Add student</button>
      </section>

      {notice && <div className="notice"><span>✓</span>{notice}</div>}
      {error && !modal && <div className="alert"><AlertCircle size={18}/>{error}<button onClick={() => setError("")}><X size={16}/></button></div>}

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon violet"><Users size={20}/></div><div><p>Total students</p><strong>{students.length}</strong></div></div>
        <div className="stat-card"><div className="stat-icon blue"><BookOpen size={20}/></div><div><p>Courses represented</p><strong>{new Set(students.map(s => s.course)).size}</strong></div></div>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><h2>All students</h2><p>Records saved in your database</p></div><button className="icon-btn" onClick={loadStudents} title="Refresh"><RefreshCw size={17}/></button></div>
        <div className="toolbar"><div className="searchbox"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email or course..." /></div><span className="result-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span></div>

        {loading ? <div className="empty"><RefreshCw className="spin" size={24}/><p>Loading student records...</p></div> :
        filtered.length === 0 ? <div className="empty"><Users size={30}/><h3>{search ? "No matching students" : "No students yet"}</h3><p>{search ? "Try another search term." : "Add your first student to get started."}</p>{!search && <button className="primary-btn" onClick={openCreate}><Plus size={17}/> Add student</button>}</div> :
        <div className="table-wrap"><table><thead><tr><th>STUDENT</th><th>COURSE</th><th>SEMESTER</th><th>ADDED</th><th className="actions-head">ACTIONS</th></tr></thead>
          <tbody>{filtered.map(s => <tr key={s._id}><td><div className="student-cell"><div className="avatar">{s.name.trim().charAt(0).toUpperCase()}</div><div><strong>{s.name}</strong><small>{s.email}</small></div></div></td><td>{s.course}</td><td><span className="semester">Semester {s.semester}</span></td><td className="date">{new Date(s.createdAt).toLocaleDateString()}</td><td><div className="actions"><button className="action edit" title="Edit" onClick={() => openEdit(s)}><Pencil size={16}/></button><button className="action delete" title="Delete" onClick={() => removeStudent(s)}><Trash2 size={16}/></button></div></td></tr>)}</tbody>
        </table></div>}
      </section>
      <footer>StudentHub <span>·</span> Full Stack Development Project 3 <span>·</span> CRUD + MongoDB</footer>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeModal()}>
      <div className="modal"><div className="modal-head"><div><p className="eyebrow">{editing ? "UPDATE RECORD" : "NEW RECORD"}</p><h2>{editing ? "Edit student" : "Add a student"}</h2></div><button className="icon-btn" onClick={closeModal}><X size={19}/></button></div>
        {error && <div className="alert modal-alert"><AlertCircle size={17}/>{error}</div>}
        <form onSubmit={submit} className="student-form">
          <label>Full name<input required minLength="2" maxLength="60" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Ayesha Khan"/></label>
          <label>Email address<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="e.g. ayesha@example.com"/></label>
          <label>Course<input required minLength="2" maxLength="80" value={form.course} onChange={e => setForm({...form, course:e.target.value})} placeholder="e.g. Computer Science"/></label>
          <label>Semester<select required value={form.semester} onChange={e => setForm({...form, semester:e.target.value})}>{Array.from({length:12},(_,i)=><option key={i+1} value={i+1}>Semester {i+1}</option>)}</select></label>
          <div className="form-actions"><button type="button" className="secondary-btn" onClick={closeModal}>Cancel</button><button disabled={saving} className="primary-btn" type="submit">{saving ? "Saving..." : editing ? "Save changes" : "Create student"}</button></div>
        </form>
      </div>
    </div>}
  </div>;
}
export default App;
