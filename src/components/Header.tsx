import React from 'react';

interface HeaderProps {
  user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  isFirebaseConnected: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing?: boolean;
  onOpenSidebar: () => void;
  projectName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isFirebaseConnected,
  onSignIn,
  onSignOut,
  isSyncing,
  onOpenSidebar,
  projectName,
}) => {
  return (
    <header className="bg-[#0e1726] text-white py-2 sm:py-2.5 px-3 sm:px-6 shadow-sm border-b border-slate-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Menu button + Brand Logo + Title + Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Compact Hamburger Menu button */}
          <button
            onClick={onOpenSidebar}
            title="Abrir Menu e Configurações"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Compact Crane Logo */}
          <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-amber-400 rounded-lg flex items-center justify-center shadow-sm shrink-0 border border-amber-300">
            <svg
              className="w-5 h-5 text-slate-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 21h4v-2H5v-4h2v-2H5v-4h2V7H5V3H3v18zm6-14v2h11.2l-1.6 2H9v2h6.8l-1.6 2H9v2h3.6l-1.6 2H9v4h12v-2h-2v-4h2v-2h-2v-4h2V7H9zm8 2h2v2h-2V9zm0 4h2v2h-2v-2z" />
            </svg>
          </div>

          {/* Brand Title with increased font size & Project Name/Location below */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[17px] sm:text-[19px] font-black tracking-tight text-white leading-tight">
              Obra Fácil
            </h1>
            <button
              onClick={onOpenSidebar}
              title="Clique para alterar o nome da obra nas configurações"
              className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-400 font-semibold truncate hover:text-amber-300 transition-colors text-left cursor-pointer"
            >
              <span className="truncate max-w-[160px] sm:max-w-xs">{projectName || 'Minha Obra'}</span>
            </button>
          </div>
        </div>

        {/* Right: User avatar or quick action */}
        {user ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSidebar}
              title="Abrir perfil e configurações"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-700 text-xs transition-colors cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                  className="w-6 h-6 rounded-full ring-1 ring-amber-400/80 object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-white text-xs font-medium max-w-[100px] truncate hidden sm:inline">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="text-[11px] sm:text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Entrar
          </button>
        )}

      </div>
    </header>
  );
};
