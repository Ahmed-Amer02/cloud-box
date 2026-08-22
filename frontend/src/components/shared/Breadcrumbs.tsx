import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  id: string;
  name: string;
  href: string;
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 font-mono text-sm text-ink-muted">
      {items.map((item, index) => (
        <span key={item.id} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-border">/</span>}
          <Link
            to={item.href}
            className={cn(
              'transition-colors',
              index === items.length - 1 ? 'text-ink' : 'hover:text-ink hover:underline',
            )}
          >
            {item.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
