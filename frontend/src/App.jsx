import { useEffect, useState } from 'react'

import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)

  useEffect(()=>{
    axios.get('...../api/vi/jokes')
    .then((response)=>{
      setCount(response.data);
    })
  })

  return (
    <>
      <div> hellow world</div>
    </>
  )
}

export default App
