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
    <header className="bg-[#172a46] dark:bg-[#0f1b2d] text-white py-3.5 sm:py-4 px-3 sm:px-6 shadow-md border-b border-[#243e68] dark:border-[#1d3250] transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4 flex-nowrap">
        
        {/* Left: Menu button + Brand Logo + Title + Project Name */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          {/* Hamburger Menu button */}
          <button
            onClick={onOpenSidebar}
            title="Abrir Menu e Configurações"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#223d66]/80 hover:bg-[#2b4c7d] text-slate-200 hover:text-white border border-[#32568c]/70 flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 shadow-xs"
          >
            <svg
              className="w-6 h-6 fill-none stroke-current stroke-[2.2]"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          </button>

          {/* Crane Logo */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 bg-amber-400 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 border border-amber-300">
            <svg
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 text-slate-900"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 21h4v-2H5v-4h2v-2H5v-4h2V7H5V3H3v18zm6-14v2h11.2l-1.6 2H9v2h6.8l-1.6 2H9v2h3.6l-1.6 2H9v4h12v-2h-2v-4h2v-2h-2v-4h2V7H9zm8 2h2v2h-2V9zm0 4h2v2h-2v-2z" />
            </svg>
          </div>

          {/* Brand Title & Project Name/Location below */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[21px] sm:text-[24px] font-black tracking-tight text-white leading-tight truncate">
              Obra Fácil
            </h1>
            <button
              onClick={onOpenSidebar}
              title="Clique para alterar o nome da obra nas configurações"
              className="flex items-center gap-1 text-[13px] sm:text-[14px] text-amber-400 font-semibold truncate hover:text-amber-300 transition-colors text-left cursor-pointer mt-0.5"
            >
              <span className={`truncate max-w-[150px] sm:max-w-xs ${!projectName ? 'opacity-85 italic' : ''}`}>
                {projectName || 'Nome da Obra / Local'}
              </span>
            </button>
          </div>
        </div>

        {/* Right: User avatar or quick action */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {user ? (
            <div className="flex items-center shrink-0">
              <button
                onClick={onOpenSidebar}
                title="Abrir perfil e configurações"
                className="flex items-center gap-2 bg-[#223d66]/80 hover:bg-[#2b4c7d] pl-2.5 pr-3.5 py-1.5 sm:py-2 rounded-xl border border-[#32568c]/70 text-sm transition-colors cursor-pointer shrink-0"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuário'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1.5 ring-amber-400 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-white text-xs sm:text-sm font-bold max-w-[110px] truncate hidden sm:inline">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="text-sm sm:text-[15px] font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
            >
              Entrar
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
