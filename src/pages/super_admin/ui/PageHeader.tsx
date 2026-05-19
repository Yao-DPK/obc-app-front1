// src/components/admin/PageHeader.tsx
interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
  }
  
  export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-heading text-primary">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }