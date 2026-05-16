'use client'

import { useEffect, useState } from 'react'

export default function CurrentDateTime() {
  const [text, setText] = useState('')

  useEffect(() => {
    const update = () =>
      setText(
        new Intl.DateTimeFormat('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date())
      )
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

  if (!text) return null
  return <span className="capitalize">{text}</span>
}
