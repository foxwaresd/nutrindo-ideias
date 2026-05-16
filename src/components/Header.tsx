import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13M12 13C12 9 9 6 5 6C5 10 8 13 12 13ZM12 13C12 9 15 6 19 6C19 10 16 13 12 13Z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              Nutrindo <span className="text-green-600">Ideias</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
