import React from 'react';

interface ProfileInfoProps {
  onLogout: () => void;
}

const getInitials = (name: string): string => {
  const parts = name.split(' ');
  const initials = parts.map(part => part[0]).join('');
  return initials.toUpperCase();
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({ onLogout }) => {
  const fullName = "Taufiq Ansari";

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(fullName)}
      </div>

      <div>
        <p className="text-sm font-medium">{fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
