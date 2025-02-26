import React from 'react'
import { useState } from 'react'

const PageFort = () => {
  const [name, setName] = useState(null);
  const [tag, setTag] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(name, tag);
    
  }
  return (
    <div className="h-screen bg-green-500">
      <form className="flex flex-col items-center justify-center h-full" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="tag">Tag</label>
        <input
          type="text"
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button type='submit'> Submit </button>
      </form>
    </div>
  );
}

export default PageFort