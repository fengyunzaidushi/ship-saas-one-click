ship-saas-one-click
├── README.md
├── app
│   ├── (policy)
│   │   ├── layout.tsx
│   │   ├── privacy-policy
│   │   │   └── page.tsx
│   │   └── terms-of-service
│   │       └── page.tsx
│   ├── [locale]
│   │   ├── (default)
│   │   │   ├── Main.tsx
│   │   │   ├── blog
│   │   │   │   ├── [...slug]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page
│   │   │   │   │   └── [page]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── docs
│   │   │   │   ├── [...slug]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── docs.md
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── name-generators
│   │   │   │   └── page.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── page.tsx
│   │   │   └── tags
│   │   │       ├── [tag]
│   │   │       │   └── page.tsx
│   │   │       └── page.tsx
│   │   ├── auth
│   │   │   └── auth-code-error
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── payment
│   │       ├── cancel
│   │       │   └── page.tsx
│   │       └── success
│   │           └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   └── check-session
│   │   │       └── route.ts
│   │   ├── characters
│   │   │   └── route.ts
│   │   ├── create-checkout-session
│   │   │   └── route.ts
│   │   ├── generate-names
│   │   │   └── route.ts
│   │   ├── profile
│   │   │   └── route.ts
│   │   ├── webhook
│   │   │   └── stripe
│   │   │       ├── route copy.ts
│   │   │       ├── route.ts
│   │   │       └── test
│   │   │           └── route.ts
│   │   └── webhooktest
│   │       └── route.ts
│   ├── auth
│   │   └── callback
│   │       └── route.ts
│   ├── favicon.ico
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── robots.ts
│   ├── seo.tsx
│   ├── sitemap.ts
│   ├── tag-data.json
│   └── theme-providers.tsx
├── beifen
│   └── [[...slug]]
│       └── page.tsx
├── components
│   ├── Comments.tsx
│   ├── GoogleAnalytics.tsx
│   ├── Header.tsx
│   ├── Image.tsx
│   ├── LanguageSwitch.tsx
│   ├── Link.tsx
│   ├── MDXComponents.tsx
│   ├── MobileNav.tsx
│   ├── PageTitle.tsx
│   ├── PricingOnetime.tsx
│   ├── ScrollTopAndComment.tsx
│   ├── SearchButton.tsx
│   ├── SearchProviderCustom.tsx
│   ├── SectionContainer.tsx
│   ├── TableWrapper.tsx
│   ├── Tag.tsx
│   ├── ThemeSwitch.tsx
│   ├── auth
│   │   └── login-button.tsx
│   ├── docs
│   │   ├── DocBreadcrumb.tsx
│   │   ├── DocHeading.tsx
│   │   ├── DocLinks.tsx
│   │   ├── DocsPager.tsx
│   │   ├── DocsSidebarNav.tsx
│   │   └── TableOfContents.tsx
│   ├── social-icons
│   │   ├── icons.tsx
│   │   └── index.tsx
│   ├── theme-provider.tsx
├── components.json
├── contentlayer.config.ts
├── css
│   └── prism.css
├── data
│   ├── authors
│   │   ├── default.mdx
│   │   └── sparrowhawk.mdx
│   ├── blog
│   │   ├── en
│   │   │   ├── Analysis-of-Four-Great-Warriors-in-Wuxia-Fiction.mdx
│   │   │   └── female
│   │   │       └── Analysis-of-Ancient-Noble-Ladies-Characters.mdx
│   │   └── zh
│   │       ├── Analysis-of-Four-Great-Warriors-in-Wuxia-Fiction.mdx
│   │       └── female
│   │           └── Analysis-of-Ancient-Noble-Ladies-Characters.mdx
│   ├── docs
│   │   ├── en
│   │   │   └── 01-getting-started
│   │   │       ├── 01-installation.mdx
│   │   │       ├── 02-project-structure.mdx
│   │   │       └── index.mdx
│   │   └── zh
│   │       └── 01-getting-started
│   │           ├── 01-installation.mdx
│   │           ├── 02-project-structure.mdx
│   │           └── index.mdx
│   ├── headerNavLinks.ts
│   ├── logo.svg
│   ├── projectsData.ts
│   ├── references-data.bib
│   └── siteMetadata.ts
├── hooks
│   └── use-toast.ts
├── i18n
│   ├── request.ts
│   └── routing.ts
├── layouts
│   ├── AuthorLayout.tsx
│   ├── ListLayout.tsx
│   ├── ListLayoutWithTags.tsx
│   ├── PostBanner.tsx
│   ├── PostLayout.tsx
│   └── PostSimple.tsx
├── lib
│   ├── helpers.ts
│   ├── prisma.ts
│   ├── seo.ts
│   ├── supabase
│   │   ├── server-client.ts
│   │   └── server.ts
│   ├── supabase.ts
│   └── utils.ts
├── messages
│   ├── en.json
│   └── zh.json
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── scripts
│   └── rss.mjs
├── sql
│   ├── create_characte_payment_table.sql
│   └── create_character_profile_table.sql
├── tailwind.config.ts
├── templates
│   └── shadcn
│       ├── assets
│       │   ├── css
│       │   │   └── style.css
│       │   └── imgs
│       │       ├── logo.png
│       │       └── preview.png
│       ├── components
│       │   ├── Cta.tsx
│       │   ├── Faq.tsx
│       │   ├── Feature.tsx
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   ├── Hero.tsx
│       │   ├── NameGenerator.tsx
│       │   ├── PricingRecu.tsx
│       │   ├── Section.tsx
│       │   ├── Testimonial.tsx
│       │   └── Usecase.tsx
│       └── pages
│           └── landing.tsx
├── translateblogs
│   └── translate
│       ├── blog_translate.py
│       ├── config.json
│       ├── docs
│       │   ├── post1.mdx
│       │   └── post2.mdx
│       ├── translated-docs
│       │   ├── post1.mdx
│       │   └── post2.mdx
│       └── translation.log
├── tree.md
├── tree.txt
├── treee.md
├── tsconfig.json
├── types
│   ├── blog.ts
│   ├── docs.d.ts
│   ├── landing.ts
│   ├── name-generators.ts
│   ├── supabase.ts
│   └── tailwindcss-animate.d.ts
├── types.d.ts
├── utils
│   └── supabase
│       ├── client.ts
│       └── middleware.ts
└── yarn.lock
