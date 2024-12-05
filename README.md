# AI Landing Page & Blog Generator

🚀 AI SaaS 快速出海模板 | AI SaaS ONE CLICK Template

一站式 AI SaaS 创业模板，内置落地页/博客生成器，支持i18n多语言本，帮助产品快速出海。集成完整用户系统和支付流程，基于 Next.js + Supabase 构建的现代化解决方案。

## 🌟 主要特性

### AI 生成功能

- 🎨 一键生成专业落地页
- 📝 AI辅助生成博客文章
- 👥 小说角色名字生成器

### 系统功能

- 🌍 多语言支持 (i18n)
- 🔐 第三方登录集成
  - Google 登录
  - Supabase 认证
- 💾 Supabase 数据存储
- 📱 响应式设计
- 🎨 基于 Tailwind CSS 的现代UI

### 技术栈

- Next.js
- Tailwind CSS
- Supabase
- i18n
- TypeScript

## 🚀 快速开始

1. 克隆项目
   ```bash
   git clone https://github.com/fengyunzaidushi/ship-saas-one-click.git
   cd ship-saas-one-click
   ```
2. 安装依赖
   ```bash
   yarn install
   ```
3. 配置环境变量

   ```bash
   cp .env.example .env

   # 修改下面变量
   # Supabase: https://supabase.com/
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=

    # api_key
    OPENAI_API_KEY=
    OPENAI_API_BASE=

   ```

4. 启动项目
   ```bash
   yarn dev
   访问 http://localhost:3000 查看效果
   ```
5. 配置数据库
   ```bash
   # 创建角色表 在supabase sql editor中执行下面文件中的sql:
   /supabase/migrations/20240320000000_create_characters_table.sql
   ```

## 📝 使用说明

### AI 落地页生成

- 修改 messages/zh.json 和 messages/en.json 中的内容
- 一键生成多语言专业落地页（其他语言同理）

### 博客mdx文档批量翻译

- 进入translateblogs/translate目录
- 修改translate.py中的源语言和目标语言
- 需要翻译的mdx文档放入进入translateblogs/translate/docs目录下
- 运行translate.py
- 翻译后的mdx文档会放入进入translateblogs/translate/translated-docs目录下

### 角色名字生成器

- 访问角色名字生成页面
- 设置角色参数
- 生成独特的角色描述

## 🔜 开发计划

### 待完善功能

- [ ] 支付系统集成
  - [ ] Stripe 支付
  - [ ] 其他支付方式
- [ ] 博客mdx格式文章一键生成
- [ ] 生成的角色名字前台展示
- [ ] 更多 AI 生成功能
- [ ] 性能优化
- [ ] 自动检测用户语言偏好

## 🤝 贡献指南

欢迎提交 Pull Request 或创建 Issue。

## 📜 致谢

本项目基于以下开源项目:

- [Pagen AI Landing Page Template](https://github.com/all-in-aigc/pagen-ai-landing-page-template)
- [Tailwind Nextjs Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)

感谢这些优秀的开源项目！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
