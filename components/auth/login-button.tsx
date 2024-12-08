'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from "@/utils/supabase/client"
import { User } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { toast } from "sonner"

type UserProfile = {
  credits: number;
}

export default function LoginButton() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const supabase = createClient()
  const t = useTranslations('public.auth')
  const params = useParams()
  const locale = params.locale as string

  // 从服务端获取用户档案信息
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      const data: UserProfile = await response.json()
      setCredits(data.credits)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast.error('Failed to fetch user profile')
    }
  }, [])

  // 检查并创建用户档案
  const checkAndCreateProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }
      
      await fetchUserProfile()
    } catch (error) {
      console.error('Error checking/creating profile:', error)
      toast.error('Failed to create user profile')
    }
  }, [fetchUserProfile])

  // 初始化用户会话
  const initializeSession = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      setUser(user)
      if (user) {
        await checkAndCreateProfile()
      }
    } catch (error) {
      console.error('Error initializing session:', error)
      toast.error('Failed to initialize session')
    } finally {
      setIsInitialized(true)
    }
  }, [supabase.auth, checkAndCreateProfile])

  useEffect(() => {
    initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        if (session?.user) {
          await checkAndCreateProfile()
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setCredits(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, checkAndCreateProfile, initializeSession])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error)
      toast.error('Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  // 在初始化完成之前显示加载状态
  if (!isInitialized) {
    return <Button variant="ghost" disabled>Loading...</Button>
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
              <AvatarFallback>{user.user_metadata.full_name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="truncate">
              {user.user_metadata.full_name || user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.user_metadata.full_name && (
                <p className="font-medium">{user.user_metadata.full_name}</p>
              )}
              {user.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              )}
              {credits !== null && (
                <p className="text-sm text-muted-foreground">
                  Credits: {credits}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleSignOut}
          >
            {t('signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2"
      variant="outline"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
        />
      </svg>
      {loading ? t('signingIn') : t('signIn')}
    </Button>
  )
} 