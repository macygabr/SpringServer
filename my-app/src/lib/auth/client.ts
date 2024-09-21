'use client';

import type { User } from '@/types/user';
import axios from 'axios';
import { Event } from '@/types/event';
import { Tag, userTag } from '@/types/tags';

const axiosInstance = axios.create({
  baseURL: 'http://37.194.168.90:2000',
});

axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request: ', request);
  return request;
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
      const response = await axiosInstance.post('auth/signup', { email, password, firstName, lastName, 
        headers: {
            Authorization: `${localStorage.getItem('custom-auth-token')}`
        }
    });
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
      const response = await axiosInstance.post('auth/signin', { email, password,
        headers: {
            Authorization: `${localStorage.getItem('custom-auth-token')}`
        }
    });
      const { token } = response.data;
      const {token_name} = response.data;
      console.log(token_name, token)
      if (token && token_name) {
        localStorage.setItem(token_name, token);
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
    try {
      const token = localStorage.getItem('custom-auth-token');
        console.log("token = " + token)
        const response = await axiosInstance.get('account/getinfo', {
            headers: {
                Authorization: `${token}`
            }
        });
        if (!response.data) {
            return { data: null };
        }
        return { data: response.data };
    } catch (error) {
        return { data: null };
    }
}

  async createEvent(eventData: Event): Promise<{ data?: any; error?: string }> {
    try {
      const response = await axiosInstance.post('events/create', eventData, {
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`,
        },
      });
      
      return { data: response.data };
    } catch (error) {
      console.error('Error creating event:', error);
      return { error: 'Failed to create event' };
    }
  }

  async saveTags(tags: userTag): Promise<{ data?: any; error?: string }> {
    console.log(tags);
    try {
      const response = await axiosInstance.post('account/tags', tags, {
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`,
        },
      });
      
      return { data: response.data };
    } catch (error) {
      console.error('Error creating event:', error);
      return { error: 'Failed to create event' };
    }
  }

  //events/count (get)

  async getMyEvent(): Promise<{ data?: any; error?: string }> {
    try {
      console.log(localStorage.getItem('custom-auth-token'));
        const response = await axiosInstance.post('events/getall', null, {
          headers: {
            Authorization: `${localStorage.getItem('custom-auth-token')}`,
          },
        });

        return { data: response.data };
    } catch (error) {
        console.error('Error fetching event:', error);
        return { error: 'Failed to fetch event' };
    }
}

async deleteEvent(eventIds: { eventId: string[] }): Promise<{ data?: any; error?: string }> {
  try {
    const response = await axiosInstance.post('events/delete', eventIds, {
      headers: {
        Authorization: `${localStorage.getItem('custom-auth-token')}`,
      },
    });

    return { data: response.data };
  } catch (error) {
    console.error('Error deleting events:', error);
    return { error: 'Failed to delete events' };
  }
}

  async uploadAvatar(file: File): Promise<{ error?: string; url?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    console.log("formData")
    try {
      const response = await axiosInstance.post('account/savefile', formData, {
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`
        },
      });

      const [status, fileUrl] = response.data;
      return { url: fileUrl };
    } catch (error) {
      return { error: 'Error uploading avatar' };
    }
  }

  async getCalendar(): Promise<{ data?: any; error?: string }> {
    try{
      const response = await axiosInstance.get('calendar/get', { 
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`
        }
       });
       return { data: response.data };
    } catch (error) {
      return { error: 'Error signing out' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try{
      const response = await axiosInstance.get('account/logout', { 
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`
        }
       });
      document.cookie = 'custom-auth-token=; path=/; max-age=0;';
      return {};
    } catch (error) {
      return { error: 'Error signing out' };
    }
  }
  
  async signUpToken(check_token: string): Promise<{ error?: string }> {
    try{
      
      const response = await axiosInstance.post('auth/confirm', { check_token } ,{
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`
        },
      });
      
      const { token } = response.data;
      const {token_name} = response.data;
      console.log(token_name, token)
      if (token && token_name) {
        localStorage.setItem(token_name, token);
      }
      return {};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return { error: error.response?.data || 'An error occurred' };
      }
      return { error: 'An unknown error occurred' };
    }
  }

  async subscribe(eventId: string): Promise<{ error?: string }> {
    try{
      console.log("eventId = " + eventId);
      const response = await axiosInstance.post('events/subscribe', { eventId } ,{
        headers: {
          Authorization: `${localStorage.getItem('custom-auth-token')}`
        },
      });
      
      const { token } = response.data;
      const {token_name} = response.data;
      console.log(token_name, token)
      if (token && token_name) {
        localStorage.setItem(token_name, token);
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
