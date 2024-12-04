import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="
      mx-auto
      w-full
      px-4
      max-w-full
      sm:max-w-[640px]
      sm:px-6
      md:max-w-[768px]
      lg:max-w-[1024px]
      xl:max-w-[1280px]
    ">
      {children}
    </section>
  )
}