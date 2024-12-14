interface DocHeadingProps {
  title: string
  description?: string
}

export default function DocHeading({ title, description }: DocHeadingProps) {
  return (
    <div className="space-y-4">
      <h1 className="inline-block text-4xl font-bold tracking-tight lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-muted-foreground">{description}</p>
      )}
    </div>
  )
} 