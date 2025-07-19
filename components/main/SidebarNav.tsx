import { NavigationItem } from './Sidebar'; // Or move this type to a shared types file if needed
import { TeamItem } from './Sidebar';
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
} // Optional utility if you moved `cn` out

export default function SidebarNav({
  general = [],
  personal = [],
  bottom = [],
  teams = [],
}: {
  general?: NavigationItem[];
  personal?: NavigationItem[];
  bottom?: NavigationItem[];
  teams?: TeamItem[];
}) {
  return (
    <nav className="flex flex-1 flex-col justify-between">
      <ul role="list" className="flex flex-col gap-y-7">
        {general.length > 0 && (
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">General</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {general.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )}

        {personal.length > 0 && (
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">Business</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {personal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )}

        {teams.length > 0 && (
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {teams.map((team) => (
                <li key={team.id}>
                  <a
                    href={team.href}
                    className={cn(
                      team.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                    )}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>

      {bottom.length > 0 && (
        <ul role="list" className="mt-4 border-t border-gray-800 pt-4 -mx-2 space-y-1">
          {bottom.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold'
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
