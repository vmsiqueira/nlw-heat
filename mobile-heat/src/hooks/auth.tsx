import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSessions from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clientId = '274179d47e07e0db8e80';
const scope = 'read:user';
const user_storage = '@mobileheat:user';
const token_storage = '@mobileheat:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponseProps = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function signIn() {
    try {
      setIsSigningIn(true);

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
      const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;

      if (authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied') {
        const authResponse = await api.post('/authenticate', { code: authSessionResponse.params.code });
        const { user, token } = authResponse.data as AuthResponseProps;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await AsyncStorage.setItem(user_storage, JSON.stringify(user));
        await AsyncStorage.setItem(token_storage, token);

        setUser(user);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSigningIn(false);    
    } 
  }

  async function signOut() {
    setUser(null);

    await AsyncStorage.removeItem(user_storage);
    await AsyncStorage.removeItem(token_storage);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(user_storage);
      const tokenStorage = await AsyncStorage.getItem(token_storage);

      if(userStorage && tokenStorage) {
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage))
      }

      setIsSigningIn(false);
    }

    loadUserStorageData();
  }, [])

  return(
    <AuthContext.Provider value={{ user, isSigningIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context;
}

export { AuthProvider, useAuth };