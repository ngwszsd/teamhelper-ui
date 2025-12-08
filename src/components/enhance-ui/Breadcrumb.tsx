import {
  BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export type Crumb = {
  key?: string | number;
  label: React.ReactNode;
  to?: string; // 推荐：SPA 跳转
  href?: string; // 备选：原生超链接
  onClick?: (crumb: Crumb) => void;
};

const Breadcrumb: React.FC<{
  items: Crumb[];
  separator?: React.ReactNode;
  className?: string;
  onClick?: (crumb: Crumb) => void;
}> = ({ items, separator = '/', className, onClick }) => {
  return (
    <BreadcrumbContainer className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const content = !isLast ? (
            item.to ? (
              <BreadcrumbLink
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item.onClick?.(item);
                  onClick?.(item);
                }}
              >
                {item.label}
              </BreadcrumbLink>
            ) : item.href ? (
              <BreadcrumbLink
                href={item.href}
                onClick={() => {
                  item.onClick?.(item);
                  onClick?.(item);
                }}
              >
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  item?.onClick?.(item);
                  onClick?.(item);
                }}
                className="cursor-pointer"
              >
                {item.label}
              </BreadcrumbLink>
            )
          ) : (
            <BreadcrumbPage>{item.label}</BreadcrumbPage>
          );

          return (
            <BreadcrumbItem key={item?.key || index}>
              {content}
              {!isLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
export { Breadcrumb as EnhancedBreadcrumb };
