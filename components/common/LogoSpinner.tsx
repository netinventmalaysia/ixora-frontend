type Props = {
  size?: number; // in px
  className?: string;
  title?: string;
};

export default function LogoSpinner({ size = 20, className = '', title = 'Loading…' }: Props) {
  return (
    <img
      src="/images/logo.png"
      alt={title}
      title={title}
      width={size}
      height={size}
      className={`animate-spin select-none ${className}`}
      draggable={false}
    />
  );
}
