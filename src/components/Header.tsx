import React from 'react';

interface HeaderProps {
  user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null } | null;
  isFirebaseConnected: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing?: boolean;
  onOpenSidebar: () => void;
  projectName?: string;
  activeObraName?: string;
  onOpenObrasModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isFirebaseConnected,
  onSignIn,
  onSignOut,
  isSyncing,
  onOpenSidebar,
  projectName,
  activeObraName,
  onOpenObrasModal,
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

          {/* App Logo */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md shadow-black/40 shrink-0 border border-slate-600/60 flex items-center justify-center bg-slate-900 group">
            <img
              src="/assets/aistudio/image_9da5d764.png"
              alt="Obra Fácil"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>

          {/* Brand Title & Active Obra Switcher */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[20px] sm:text-[23px] font-black tracking-tight text-white leading-tight truncate">
              Obra Fácil
            </h1>
            <button
              onClick={onOpenObrasModal || onOpenSidebar}
              title="Clique para alternar ou cadastrar novas obras"
              className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] bg-slate-100 dark:bg-[#132238] hover:bg-slate-200 dark:hover:bg-[#182b47] border border-slate-300 dark:border-slate-300 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2.5 py-0.5 rounded-full font-bold truncate transition-all text-left cursor-pointer mt-1 max-w-[190px] sm:max-w-xs group active:scale-95 shadow-2xs"
            >
              <span className="truncate">{activeObraName || projectName || 'Minha Obra'}</span>
              <svg
                className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 group-hover:translate-y-0.5 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
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
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1.5 ring-slate-400 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center">
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
              className="text-sm sm:text-[15px] font-extrabold bg-slate-500 hover:bg-slate-400 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95 shrink-0 whitespace-nowrap border border-slate-400/40"
            >
              Entrar
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
