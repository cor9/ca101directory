"use client";

import React, { createContext, useContext, useState } from 'react';

const CommandDialogContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

export const CommandDialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <CommandDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandDialogContext.Provider>
  );
};

export const useCommandDialog = () => {
  const context = useContext(CommandDialogContext);
  if (context === undefined) {
    throw new Error('useCommandDialog must be used within a CommandDialogProvider');
  }
  return context;
};