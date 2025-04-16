import { useState } from "react";
import "./App.css";

const checkboxData = [
  {
    id: 1,
    label: "Fruits",
    checked: false,
    children: [
      {
        id: 2,
        label: "Citrus",
        checked: false,
        children: [
          { id: 3, label: "Orange", checked: false },
          { id: 4, label: "Lemon", checked: false },
        ],
      },
      {
        id: 5,
        label: "Berries",
        checked: false,
        children: [
          { id: 6, label: "Strawberry", checked: false },
          { id: 7, label: "Blueberry", checked: false },
        ],
      },
    ],
  },
  {
    id: 8,
    label: "Vegetables",
    checked: false,
    children: [
      { id: 9, label: "Carrot", checked: false },
      { id: 10, label: "Spinach", checked: false },
    ],
  },
];

function Checkbox({ data , checked , setChecked }) {

let handlechange = (e, node) => {
  setChecked(prev => {
    const newState = {...prev, [node.id] : e.target.checked }

    function updateChild (node) {
      if(node.children){
        node.children?.forEach(child => {
          newState[child.id] = e.target.checked 
          child.children && updateChild(child)
        })
      }
    }
    updateChild(node)

    function verifiedChecked(node){
      if(!node.children) return newState[node.id] || false;

      const allChildrenChecked = node.children.every(child =>  verifiedChecked(child));
      newState[node.id] = allChildrenChecked
      return allChildrenChecked
    }
    checkboxData.forEach(node => verifiedChecked(node))
    return newState
  })

}

  return data.map((node) => (
    <div key={node.id}>
    <div  style={{  paddingLeft : "20px"}}>
      <input type="checkbox" checked={checked[node?.id] || false} onChange={(e) => handlechange(e,node)} /> <span>{node.label}</span>
      {node.children &&  <Checkbox data={node.children} checked={checked} setChecked={setChecked}  />}
    </div>
    </div>
  ));
}

function App() {
  const [checked, setChecked] = useState({1: true});

  return (
    <>
      <div>
        <Checkbox data={checkboxData} checked={checked} setChecked={setChecked} />
      </div>
    </>
  );
}

export default App;
