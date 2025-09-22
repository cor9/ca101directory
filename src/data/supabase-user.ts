import { supabase } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  created_at: string
  updated_at: string
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('getUserByEmail error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('getUserByEmail error:', error)
    return null
  }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('getUserById error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('getUserById error:', error)
    return null
  }
}

export const createUser = async (userData: {
  id: string
  email: string
  name: string
  role?: 'USER' | 'ADMIN'
}): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'USER',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('createUser error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('createUser error:', error)
    return null
  }
}

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('updateUser error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('updateUser error:', error)
    return null
  }
}
