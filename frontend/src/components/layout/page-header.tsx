interface PageHeaderProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export function DemoBanner() {
  return <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm">Demo Mode</div>;
}
export function DemoBanner() { return <div className='bg-yellow-100 text-yellow-800 p-2 text-center text-sm'>Demo Mode</div>; }

