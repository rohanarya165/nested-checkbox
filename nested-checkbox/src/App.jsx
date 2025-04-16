import { useState } from "react";
import "./App.css";

// ⚙️ Ye hai pura checkbox ka data — nested format me
const checkboxData = [
  {
    id: 1,
    label: "Fruits",
    children: [
      {
        id: 2,
        label: "Citrus",
        children: [
          { id: 3, label: "Orange" },
          { id: 4, label: "Lemon" },
        ],
      },
      {
        id: 5,
        label: "Berries",
        children: [
          { id: 6, label: "Strawberry" },
          { id: 7, label: "Blueberry" },
        ],
      },
    ],
  },
  {
    id: 8,
    label: "Vegetables",
    children: [
      { id: 9, label: "Carrot" },
      { id: 10, label: "Spinach" },
    ],
  },
];

// ✅ Ye hai main checkbox component jo har level pe chalega (recursive)
function CheckboxTree({ data, checked, setChecked }) {
  
  // 🔁 Jab user checkbox pe click kare
  const handleChange = (e, node) => {
    const isChecked = e.target.checked; // user ne check kiya ya nahi

    setChecked((prev) => {
      const newState = { ...prev, [node.id]: isChecked }; // abhi ka state copy kar liya

      // 🔽 STEP 1: Sare bacchon ko bhi update karo (agar hain)
      const updateChildren = (n) => {
        if (n.children) {
          n.children.forEach((child) => {
            newState[child.id] = isChecked; // baccha bhi same state le lega
            updateChildren(child); // agar baccha ka baccha hai to usko bhi
          });
        }
      };
      updateChildren(node); // call kar diya

      // 🔼 STEP 2: Upar wale parents ka bhi update karo
      const updateParents = (nodes) => {
        nodes.forEach((n) => {
          if (n.children) {
            // Pehle bacchon ko handle karo
            n.children.forEach((child) => updateParents([child]));

            // Check karo ki kya sab bacche checked hain
            const allChildrenChecked = n.children.every(
              (child) => newState[child.id]
            );
            newState[n.id] = allChildrenChecked; // agar sab checked hain to parent bhi checked
          }
        });
      };
      updateParents(checkboxData); // full tree ko parent-wise check kiya

      return newState; // naya state bhej diya
    });
  };

  // 📦 Render kar rahe hain har checkbox ko
  return data.map((node) => (
    <div key={node.id} style={{ paddingLeft: "20px" }}>
      <label>
        <input
          type="checkbox"
          checked={checked[node.id] || false} // agar state me nahi hai to false hi samjho
          onChange={(e) => handleChange(e, node)} // click hone pe kya karna hai
        />{" "}
        {node.label}
      </label>

      {/* 👇 Agar is node ke bacche hain to unko bhi recursively render karo */}
      {node.children && (
        <CheckboxTree
          data={node.children}
          checked={checked}
          setChecked={setChecked}
        />
      )}
    </div>
  ));
}

// 🔧 Main app
function App() {
  const [checked, setChecked] = useState({}); // sara checkbox ka status yahan store hoga

  return (
    <div className="App">
      <h2>🌳 Nested Checkbox Example</h2>

      {/* 👇 Yahan se pura tree render hoga */}
      <CheckboxTree
        data={checkboxData}
        checked={checked}
        setChecked={setChecked}
      />

      {/* 🧪 Debug ke liye pura state dikha diya */}
      <h3>🧾 Checked State:</h3>
      <pre>{JSON.stringify(checked, null, 2)}</pre>
    </div>
  );
}

export default App;
