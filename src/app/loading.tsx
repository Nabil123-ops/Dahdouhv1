import React from 'react'

const Loading = () => {
  return (
    <section className='h-full w-full grid place-content-center'>
      <div className='flex items-center justify-center gap-3 text-8xl'>
        <img 
          src="/logo.jpg" 
          alt="Dahdouh AI"
          className="w-20 h-20 object-contain"
        />
      </div>

      <div className="loader" />
    </section>
  )
}

export default Loading