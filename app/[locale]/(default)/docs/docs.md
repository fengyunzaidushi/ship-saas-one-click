# 文档渲染逻辑

## 1. 文件结构

文档相关的主要文件:

- `app/[locale]/(default)/docs/[...slug]/page.tsx` - 文档页面组件
- `app/[locale]/(default)/docs/layout.tsx` - 文档布局组件
- `app/[locale]/(default)/docs/page.tsx` - 文档首页重定向
- `data/docs/{locale}/**/*.mdx` - 文档源文件

## 2. 路由处理

### 2.1 动态路由

使用 Next.js 的动态路由 `[...slug]` 来匹配文档路径:

```typescript
interface DocPageProps {
  params: {
    slug?: string[]; // 文档路径片段
    locale: string; // 语言
  };
}
```

### 2.2 路径格式化

文档路径会去掉数字前缀,如 `01-getting-started` 格式化为 `getting-started`:

```typescript
function formatSlug(path: string): string {
  const parts = path.split("/");
  const docsIndex = parts.findIndex((part) => part === "docs");
  const relevantParts = parts.slice(docsIndex + 1);
  return relevantParts.map((part) => part.replace(/^\d+-/, "")).join("/");
}
```

## 3. 文档获取

### 3.1 按语言过滤

根据 locale 参数过滤对应语言的文档:

```typescript
const localeDocs = allDocs.filter((doc) => {
  const docLocale = doc.filePath.split("/")[1];
  return docLocale === locale;
});
```

### 3.2 文档查找

根据格式化后的路径查找具体文档:

```typescript
const doc = localeDocs.find((doc) => {
  const formattedDocSlug = formatSlug(doc.path);
  return slug === "" ? formattedDocSlug === "index" : formattedDocSlug === slug;
});
```

## 4. 页面布局

### 4.1 布局结构

文档页面采用左侧导航 + 主内容 + 右侧目录的三栏布局:

```tsx
<div className="container">
  <aside>
    <DocsSidebarNav /> {/* 左侧导航 */}
  </aside>
  <main>
    <article>
      <DocBreadcrumb /> {/* 面包屑导航 */}
      <DocHeading /> {/* 文档标题 */}
      <DocLinks /> {/* 相关链接 */}
      <MDXContent /> {/* 文档内容 */}
      <DocsPager /> {/* 上一篇/下一篇 */}
    </article>
    <div>
      <TableOfContents /> {/* 右侧目录 */}
    </div>
  </main>
</div>
```

### 4.2 文章导航布局
对于第一篇文档：只显示下一篇
对于最后一篇文档：只显示上一篇
对于中间的文档：同时显示上一篇和下一篇
文档顺序与文件系统中的顺序保持一致

### 4.2 响应式设计

- 移动端隐藏侧边栏和目录
- 桌面端显示完整三栏布局
- 侧边栏固定定位,可滚动

## 5. 首页重定向

文档首页会重定向到第一个文档:

```typescript
const firstDoc = docs.find((doc) =>
  doc.slugAsParams.includes("getting-started")
);
const path = formatDocPath(firstDoc.path, locale);
redirect(path);
```

## 6. 元数据处理

### 6.1 文档元数据

文档包含以下元数据:

- title - 文档标题
- description - 文档描述
- nav_title - 导航标题
- related - 相关链接
- toc - 是否显示目录

### 6.2 SEO 优化

生成文档页面的 metadata:

```typescript
return genPageMetadata({
  title: doc.title,
  description: doc.description,
  params: { locale },
});
```
