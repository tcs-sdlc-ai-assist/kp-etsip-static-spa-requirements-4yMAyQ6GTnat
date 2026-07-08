import React, { useState, useEffect } from 'react';
import { accessControlService } from '@/services/accessControlService';
import { userRepository } from '@/repositories/userRepository';
import type { User } from '@/types/entities';

const RoleSwitcher = () => {
  const [currentPersona, setCurrentPersona] = useState<{ id: string; name: string } | null>(null);
  const [currentPersonaError, setCurrentPersonaError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadCurrentPersona = async () => {
      try {
        setCurrentPersonaError(null);
        const persona = await accessControlService.getCurrentPersona();
        if (isMounted) {
          setCurrentPersona({
            id: persona?.id ?? '',
            name: persona?.name ?? 'Unknown'
          });
        }
      } catch (err) {
        if (isMounted) {
          setCurrentPersonaError('Failed to load current persona');
        }
      }
    };

    const loadUsers = async () => {
      try {
        setUsersError(null);
        const usersList = await userRepository.getAll();
        if (isMounted) {
          setUsers(usersList);
        }
      } catch (err) {
        if (isMounted) {
          setUsersError('Failed to load users');
        }
      }
    };

    loadCurrentPersona();
    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSwitch = async (userId: string) => {
    try {
      await accessControlService.switchPersona(userId);
      const persona = await accessControlService.getCurrentPersona();
      if (persona) {
        setCurrentPersona({
          id: persona.id,
          name: persona.name
        });
        setCurrentPersonaError(null);
      }
      setOpen(false);
    } catch (err) {
      setCurrentPersonaError('Failed to switch persona');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-kp-background text-kp-text rounded-md border border-kp-secondary">
        <span className="animate-spin h-4 w-4 border-2 border-kp-secondary border-t-kp-primary rounded-full"></span>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className={`flex items-center space-x-2 px-3 py-2 bg-kp-background text-kp-text rounded-md border border-kp-secondary hover:bg-kp-secondary/10 focus:outline-none focus:ring-2 focus:ring-kp-primary ${
          currentPersonaError ? 'border-kp-accent' : ''
        }`}
        onClick={() => setOpen(!open)}
      >
        {currentPersonaError ? (
          <span className="h-4 w-4">!</span>
        ) : (
          <span className="h-4 w-4">👤</span>
        )}
        <span className="flex-1 truncate">
          {currentPersonaError ? 'Error' : currentPersona?.name ?? 'Unknown'}
        </span>
        <span className="h-4 w-4 text-kp-secondary">{'▾'}</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-56 bg-kp-background rounded-md shadow-lg border border-kp-secondary">
          {usersError ? (
            <div className="px-2 py-2 text-kp-text text-kp-accent">{usersError}</div>
          ) : users.length === 0 ? (
            <div className="px-2 py-2 text-kp-text">No users available</div>
          ) : (
            <div className="px-2 py-2 space-y-1">
              {users.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-2 px-2 py-2 text-sm cursor-pointer hover:bg-kp-secondary/10 ${user.id === currentPersona?.id ? 'bg-kp-secondary/20' : ''}`}
                  onClick={() => handleSwitch(user.id)}
                >
                  <span className="truncate max-w-xs">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-kp-text/50 text-xs">(@{user.username})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
</file>