import React, { useState, useEffect } from 'react';
import { accessControlService } from '@/services/accessControlService';
import { AccessLevel } from '@/types/enums';
import RoleSwitcher from '@/components/RoleSwitcher';

const HomeScreen: React.FC = () => {
  const [currentPersona, setCurrentPersona] = useState<{
    id: string
    name: string
    email: string
    roleIds: string[]
    persona: string
    permissionLevel: number
  } | null>(null);
  const [currentAccessLevel, setCurrentAccessLevel] = useState<AccessLevel>(AccessLevel.Guest);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const persona = await accessControlService.getCurrentPersona();
        const accessLevel = await accessControlService.getCurrentAccessLevel();
        
        if (isMounted) {
          if (persona) {
            setCurrentPersona(persona);
          }
          setCurrentAccessLevel(accessLevel);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load persona data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-kp-background">
        <div className="animate-spin h-8 w-8 border-2 border-kp-secondary border-t-kp-primary rounded-full"></div>
        <p className="mt-4 text-kp-text">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-kp-background">
        <p className="text-kp-accent">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-kp-primary text-white rounded-md hover:bg-kp-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-kp-background">
      <header className="bg-kp-primary/5 px-4 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-kp-text">KP ETSIP SPA</h1>
          <p className="mt-1 text-kp-text/70">Home Screen</p>
        </div>
      </header>
      
      <main className="flex-1 px-4 py-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Current Persona Card */}
          <div className="bg-kp-background/50 border border-kp-secondary rounded-lg p-6">
            <h2 className="text-xl font-semibold text-kp-text mb-4">Current Persona</h2>
            {currentPersona ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-kp-secondary/20 rounded-full flex items-center justify-center">
                    <span className="text-kp-text/60">{currentPersona.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-kp-text">{currentPersona.name}</p>
                    <p className="text-kp-text/50 text-sm">{currentPersona.email}</p>
                    <p className="text-kp-text/50 text-sm">{currentPersona.persona}</p>
                  </div>
                </div>
                
                <div className="border-t border-kp-secondary/20 pt-4">
                  <p className="text-kp-text/50 text-sm">Role IDs: {currentPersona.roleIds.join(', ') || 'None'}</p>
                  <p className="text-kp-text/50 text-sm">Permission Level: {currentPersona.permissionLevel}</p>
                </div>
              </div>
            ) : (
              <p className="text-kp-text/50">No active persona</p>
            )}
          </div>
          
          {/* Access Level Card */}
          <div className="bg-kp-background/50 border border-kp-secondary rounded-lg p-6">
            <h2 className="text-xl font-semibold text-kp-text mb-4">Current Access Level</h2>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-kp-secondary/20 rounded-flex items-center justify-center">
                <span className="text-kp-text/60">{AccessLevel[currentAccessLevel].charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-kp-text">{AccessLevel[currentAccessLevel]}</p>
                <p className="text-kp-text/50 text-sm">Level: {currentAccessLevel}</p>
              </div>
            </div>
          </div>
          
          {/* Role Switcher */}
          <div className="bg-kp-background/50 border border-kp-secondary rounded-lg p-6">
            <h2 className="text-xl font-semibold text-kp-text mb-4">Role Switcher</h2>
            <p className="text-kp-text/50 mb-4">
              Switch between different user personas to demonstrate access control functionality.
            </p>
            <RoleSwitcher />
          </div>
        </div>
      </main>
      
      <footer className="bg-kp-primary/5 px-4 py-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-kp-text/50 text-sm">
          KP ETSIP Static SPA Edition &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default HomeScreen;