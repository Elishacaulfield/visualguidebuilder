import { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";

const icons = {
  sound: "🔊",
  lighting: "💡",
  communication: "💬",
  access: "♿",
  toilet: "🚻"
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image: null,
    sound: "",
    lighting: "",
    communication: "",
    access: "",
    toiletAccess: ""
  });
  const [dragIndex, setDragIndex] = useState(null);
  const [highContrast, setHighContrast] = useState(false);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) handleChange("image", URL.createObjectURL(file));
  };

  const addEntry = () => {
    if (!form.title || !form.image) return;
    setEntries([...entries, form]);
    setForm({
      title: "",
      image: null,
      sound: "",
      lighting: "",
      communication: "",
      access: "",
      toiletAccess: ""
    });
  };

  const onDragStart = (i) => setDragIndex(i);

  const onDrop = (i) => {
    const updated = [...entries];
    const item = updated.splice(dragIndex, 1)[0];
    updated.splice(i, 0, item);
    setEntries(updated);
  };

  useEffect(() => {
    const saved = localStorage.getItem("guide");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveGuide = () => {
    localStorage.setItem("guide", JSON.stringify(entries));
    alert("Guide saved on this device.");
  };

  const exportPDF = () => window.print();

  return (
    <div style={{
      padding: "20px",
      maxWidth: "800px",
      margin: "auto",
      background: highContrast ? "black" : "white",
      color: highContrast ? "white" : "black"
    }}>
      <h1>Accessible Space Visual Guide</h1>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setHighContrast(!highContrast)}>Toggle High Contrast</button>
        <button onClick={saveGuide}>Save</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Area name"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <br /><br />

        <input type="file" accept="image/*" onChange={handleImage} />
        <br /><br />

        <select onChange={(e) => handleChange("sound", e.target.value)}>
          <option value="">Sound</option>
          <option value="chatter">Chatter</option>
          <option value="music">Music</option>
          <option value="traffic">Traffic</option>
          <option value="construction">Construction</option>
        </select>

        <select onChange={(e) => handleChange("lighting", e.target.value)}>
          <option value="">Lighting</option>
          <option value="natural">Natural</option>
          <option value="fluorescent">Fluorescent</option>
          <option value="led">LED</option>
          <option value="warm">Warm</option>
        </select>

        <select onChange={(e) => handleChange("communication", e.target.value)}>
          <option value="">Communication</option>
          <option value="conversation">Conversation</option>
          <option value="text">Text</option>
          <option value="aac">AAC</option>
          <option value="isl">Irish Sign Language</option>
        </select>

        <select onChange={(e) => handleChange("access", e.target.value)}>
          <option value="">Access</option>
          <option value="ramps">Ramps</option>
          <option value="steps">Steps</option>
        </select>

        <select onChange={(e) => handleChange("toiletAccess", e.target.value)}>
          <option value="">Wheelchair Toilet</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <br /><br />
        <button onClick={addEntry}>Add Section</button>
      </div>

      {entries.map((entry, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(i)}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <GripVertical size={16} />
            <h2>{entry.title}</h2>
          </div>

          {entry.image && (
            <img src={entry.image} alt="" style={{ width: "100%", borderRadius: "10px" }} />
          )}

          <p>{icons.sound} {entry.sound}</p>
          <p>{icons.lighting} {entry.lighting}</p>
          <p>{icons.communication} {entry.communication}</p>
          <p>{icons.access} {entry.access}</p>
          <p>{icons.toilet} {entry.toiletAccess}</p>
        </div>
      ))}
    </div>
  );
}
