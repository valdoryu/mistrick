import AgentsIcon from "./icons/agents";
import ChatIcon from "./icons/chat";
import ConnectionsIcon from "./icons/connections";
import LibrariesIcon from "./icons/libraries";
import SidebarLink from "./SidebarLink";

export default function SidebarContent() {
  return (
    <ul className="mt-10">
      <li>
        <SidebarLink href="/chat" label="Chat" Icon={ChatIcon} />
      </li>
      <li>
        <SidebarLink href="/agents" label="Agents" Icon={AgentsIcon} is_beta />
      </li>
      <li>
        <SidebarLink href="/libraries" label="Bibliothèques" Icon={LibrariesIcon} is_beta />
      </li>
      <li>
        <SidebarLink href="/connections" label="Connexions" Icon={ConnectionsIcon} is_beta />
      </li>
    </ul>
  )
}