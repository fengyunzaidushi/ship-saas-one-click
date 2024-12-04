'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

const languageMap: { [key: string]: string } = {
  'en': 'English',
  'zh': '中文',
  // 可以根据需要添加更多语言
}

export default function LanguageSwitch() {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (locale: string) => {
    // 从当前路径中提取出除了语言之外的路径部分
    const pathWithoutLocale = pathname.split('/').slice(2).join('/')
    const newPath = `/${locale}/${pathWithoutLocale}`
    router.push(newPath)
  }

  // 获取当前语言
  const currentLocale = pathname.split('/')[1]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languageMap).map(([locale, label]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={currentLocale === locale ? 'bg-accent' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 