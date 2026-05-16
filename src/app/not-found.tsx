import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-96 flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <span className="text-3xl font-black text-green-600">?</span>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
      <p className="text-gray-500 mb-8 max-w-sm">Esta página não foi encontrada. Pode ter sido movida ou não existe.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar ao início
      </Link>
    </div>
  )
}
