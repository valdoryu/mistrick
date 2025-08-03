import AgentsIcon from '@/components/icons/agents'
import ChatIcon from '@/components/icons/chat'
import ConnectionsIcon from '@/components/icons/connections'
import LibrariesIcon from '@/components/icons/libraries'
import SidebarNavLink from './SidebarNavLink'

export default function SidebarNav() {
  return (
    <ul className="mt-10">
      <li>
        <SidebarNavLink href="/chat" label="Chat" Icon={ChatIcon} />
      </li>
      <li>
        <SidebarNavLink
          href="/agents"
          label="Agents"
          Icon={AgentsIcon}
          is_beta
        />
      </li>
      <li>
        <SidebarNavLink
          href="/libraries"
          label="Bibliothèques"
          Icon={LibrariesIcon}
          is_beta
        />
      </li>
      <li>
        <SidebarNavLink
          href="/connections"
          label="Connexions"
          Icon={ConnectionsIcon}
          is_beta
        />
      </li>
    </ul>
  )
}
