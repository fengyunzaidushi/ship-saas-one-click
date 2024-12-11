'use client'

import siteMetadata from '@/data/siteMetadata'

import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LanguageSwitch from './LanguageSwitch'
import LoginButton from "./auth/login-button"
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
const Header = () => {
  // Use client-side state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [loginError, setLoginError] = useState<Error | null>(null)
  const t = useTranslations('saas_one.header.nav')
  const navItems = t.raw('items')

  useEffect(() => {
    setMounted(true)
  }, [])

  let headerClass = 'flex items-center bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <header className={headerClass}></header>
  }

  return (
    <header className={headerClass}>
      
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <span className="text-2xl font-bold sm:hidden">{siteMetadata.headerTitle}</span>
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
            {navItems
              .filter((link) => link.url !== '/')
              .map((link) => (
                <Link
                  key={link.title}
                  href={link.url}
                  className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                  // target={link.target}
                >
                  {link.title}
                </Link>
              ))}
          </div>
          <SearchButton />
          <ThemeSwitch />
          <LanguageSwitch />
          <div className="flex items-center justify-center">
            <LoginButton />
          </div>

          <MobileNav />
        </div>
      
    </header>
  )
}

export default Header
