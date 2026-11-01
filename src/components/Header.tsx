import React from 'react';

interface HeaderProps {
  user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  isFirebaseConnected: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing?: boolean;
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isFirebaseConnected,
  onSignIn,
  onSignOut,
  isSyncing,
  onOpenSidebar,
}) => {
  return (
    <header className="bg-[#0e1726] text-white pt-5 pb-6 px-4 sm:px-6 shadow-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Menu button + Logo and Brand Title matching screenshot */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu button */}
          <button
            onClick={onOpenSidebar}
            title="Abrir Menu e Configurações"
            className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <svg
              className="w-5 h-5 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="w-12 h-12 sm:w-13 sm:h-13 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border border-amber-300">
            {/* Construction Crane & Building Icon matching the screenshot */}
            <svg
              className="w-9 h-9 text-slate-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* Construction Crane Tower & Boom */}
              <path d="M3 21h4v-2H5v-4h2v-2H5v-4h2V7H5V3H3v18zm6-14v2h11.2l-1.6 2H9v2h6.8l-1.6 2H9v2h3.6l-1.6 2H9v4h12v-2h-2v-4h2v-2h-2v-4h2V7H9zm8 2h2v2h-2V9zm0 4h2v2h-2v-2z" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white leading-tight">
              Obra Fácil
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-normal">
              Controle de Gastos Simplificado
            </p>

            {/* Firebase Status Badge matching screenshot */}
            <div className="mt-1.5 flex items-center gap-2">
              <button
                onClick={onOpenSidebar}
                title="Configurações de Sincronização e Firebase"
                className="inline-flex items-center gap-1.5 bg-[#1b263b] hover:bg-[#22304a] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-700/80 shadow-inner cursor-pointer transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isFirebaseConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isFirebaseConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className="text-[11px] text-slate-200">
                  {isSyncing ? 'Sincronizando...' : isFirebaseConnected ? 'Firebase Conectado' : 'Conectando ao Firebase...'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* User avatar when logged in (clicking opens sidebar) */}
        {user && (
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              onClick={onOpenSidebar}
              title="Abrir perfil e configurações"
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 pl-2 pr-3 py-1.5 rounded-full border border-slate-700 text-xs transition-colors cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                  className="w-7 h-7 rounded-full ring-2 ring-amber-400/80 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-white text-xs font-semibold max-w-[120px] truncate hidden sm:inline">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
