import Link from 'next/link'

export default function Footer() {
  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/topicos', label: 'Tópicos' },
    { href: '/tags', label: 'Tags' },
  ]

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 pb-10 border-b border-white/5">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-900/40">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13M12 13C12 9 9 6 5 6C5 10 8 13 12 13ZM12 13C12 9 15 6 19 6C19 10 16 13 12 13Z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Nutrindo <span className="text-green-500">Ideias</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Blog de nutrição escrito pela nutricionista <span className="text-gray-200 font-medium">Evelyn Camargo</span>.
              Ciência, praticidade e leveza para transformar sua relação com a alimentação.
            </p>
            <p className="mt-4 text-xs text-gray-600 font-medium uppercase tracking-widest">
              Nutrição com propósito
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Navegação</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/5">
              <Link
                href="/admin"
                className="text-xs text-gray-700 hover:text-gray-500 transition-colors"
              >
                Acesso restrito
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Nutrindo Ideias — Evelyn Camargo. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-600/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V13M12 13C12 9 9 6 5 6C5 10 8 13 12 13ZM12 13C12 9 15 6 19 6C19 10 16 13 12 13Z" />
              </svg>
            </div>
            <span>por Evelyn Camargo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
