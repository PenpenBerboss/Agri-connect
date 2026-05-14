import { supabase } from '../lib/supabase';

export interface AuthCredentials {
  email: string;
  password?: string;
  name?: string;
  role?: 'farmer' | 'buyer';
  phone?: string;
}

export const authService = {
  signUp: async (credentials: AuthCredentials) => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password!,
      options: {
        data: {
          role: credentials.role,
          name: credentials.name
        }
      }
    });
    if (error) throw error;
    return data;
  },

  signIn: async (credentials: AuthCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password!,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
};
