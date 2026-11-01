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
    <header className="bg-[#0e1726] text-white py-3 sm:py-3.5 px-4 sm:px-6 shadow-sm border-b border-slate-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Menu button + Brand Logo + Title + Project Name */}
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          {/* Hamburger Menu button */}
          <button
            onClick={onOpenSidebar}
            title="Abrir Menu e Configurações"
            className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/90 flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 shadow-2xs"
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

          {/* Crane Logo */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/10 shrink-0 border border-amber-300">
            <svg
              className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-slate-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 21h4v-2H5v-4h2v-2H5v-4h2V7H5V3H3v18zm6-14v2h11.2l-1.6 2H9v2h6.8l-1.6 2H9v2h3.6l-1.6 2H9v4h12v-2h-2v-4h2v-2h-2v-4h2V7H9zm8 2h2v2h-2V9zm0 4h2v2h-2v-2z" />
            </svg>
          </div>

          {/* Brand Title & Project Name/Location below */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[19px] sm:text-[22px] font-black tracking-tight text-white leading-tight">
              Obra Fácil
            </h1>
            <button
              onClick={onOpenSidebar}
              title="Clique para alterar o nome da obra nas configurações"
              className="flex items-center gap-1 text-xs sm:text-[13px] text-amber-400 font-semibold truncate hover:text-amber-300 transition-colors text-left cursor-pointer mt-0.5"
            >
              <span className="truncate max-w-[180px] sm:max-w-xs">{projectName || 'Minha Obra'}</span>
            </button>
          </div>
        </div>

        {/* Right: User avatar or quick action */}
        {user ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSidebar}
              title="Abrir perfil e configurações"
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 pl-2 pr-3 py-1.5 rounded-full border border-slate-700 text-xs transition-colors cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuário'}
                  className="w-7 h-7 rounded-full ring-1.5 ring-amber-400/80 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 font-bold text-xs flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-white text-xs font-semibold max-w-[120px] truncate hidden sm:inline">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            Entrar
          </button>
        )}

      </div>
    </header>
  );
};
