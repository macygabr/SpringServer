'use client';

import type { User } from '@/types/user';
import axios from 'axios';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const axiosInstance = axios.create({
  baseURL: 'http://37.194.168.90:2000',
});

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    const { email, password, firstName, lastName } = params;

    try {
      const response = await axiosInstance.post('auth/signup', { email, password, firstName, lastName });
      return {};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data || 'An error occurred' };
      }
      return { error: 'An unknown error occurred' };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    try {
      const response = await axiosInstance.post('auth/signin', { email, password });
      const { token_value } = response.data;
      const {token_name} = response.data;

      if (token_value && token_name) {
        document.cookie = `${token_name}=${token_value}; path=/; max-age=3600`;
      }
      return {};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data || 'An error occurred' };
      }
      return { error: 'An unknown error occurred' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try{
      const response = await axiosInstance.get('account/getInfo', { withCredentials: true });
      if (!response.data) {
        return { data: null };
      }
      return { data: response.data };
    } catch (error) {
      return { data: null};
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try{
      const response = await axiosInstance.get('account/logout', { withCredentials: true });
      return {};
    } catch (error) {
      return { error: 'Error signing out' };
    }
  }
  
  async signUpToken(token: string): Promise<{ error?: string }> {
    try{
      const response = await axiosInstance.post('auth/confirm', { token });
      const { token_value } = response.data;
      const {token_name} = response.data;
      
      if (token_value && token_name) {
        document.cookie = `${token_name}=${token_value}; path=/; max-age=3600`;
      }
      return {};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data || 'An error occurred' };
      }
      return { error: 'An unknown error occurred' };
    }
  }

}

export const authClient = new AuthClient();
