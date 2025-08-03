import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SidebarNav from '../SidebarNav'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/chat'),
}))

// Mock the Tag component
jest.mock('@/components/Tag', () => {
  return function MockTag({ label }: { label: string }) {
    return <div data-testid="tag">{label}</div>
  }
})

// Mock SidebarNavLink component
jest.mock('../SidebarNavLink', () => {
  return function MockSidebarNavLink({
    href,
    label,
    Icon,
    is_beta,
  }: {
    href: string
    label: string
    Icon: React.ComponentType<{ className: string }>
    is_beta?: boolean
  }) {
    return (
      <div data-testid="sidebar-nav-link" data-href={href} data-beta={is_beta}>
        <span>{label}</span>
        <Icon className="icon" />
        {is_beta && <span data-testid="beta-indicator">Beta</span>}
      </div>
    )
  }
})

// Mock icon components
jest.mock('@/components/icons/agents', () => {
  return function MockAgentsIcon({ className }: { className: string }) {
    return <div className={className}>AgentsIcon</div>
  }
})

jest.mock('@/components/icons/chat', () => {
  return function MockChatIcon({ className }: { className: string }) {
    return <div className={className}>ChatIcon</div>
  }
})

jest.mock('@/components/icons/connections', () => {
  return function MockConnectionsIcon({ className }: { className: string }) {
    return <div className={className}>ConnectionsIcon</div>
  }
})

jest.mock('@/components/icons/libraries', () => {
  return function MockLibrariesIcon({ className }: { className: string }) {
    return <div className={className}>LibrariesIcon</div>
  }
})

describe('SidebarNav', () => {
  it('renders all navigation links', () => {
    render(<SidebarNav />)

    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Agents')).toBeInTheDocument()
    expect(screen.getByText('Bibliothèques')).toBeInTheDocument()
    expect(screen.getByText('Connexions')).toBeInTheDocument()
  })

  it('renders Chat link without beta indicator', () => {
    render(<SidebarNav />)

    const chatLinks = screen.getAllByTestId('sidebar-nav-link')
    const chatLink = chatLinks.find(
      (link) => link.getAttribute('data-href') === '/chat'
    )

    expect(chatLink).toHaveAttribute('data-beta', 'undefined')
    expect(
      chatLink?.querySelector('[data-testid="beta-indicator"]')
    ).not.toBeInTheDocument()
  })

  it('renders Agents link with beta indicator', () => {
    render(<SidebarNav />)

    const chatLinks = screen.getAllByTestId('sidebar-nav-link')
    const agentsLink = chatLinks.find(
      (link) => link.getAttribute('data-href') === '/agents'
    )

    expect(agentsLink).toHaveAttribute('data-beta', 'true')
    expect(
      agentsLink?.querySelector('[data-testid="beta-indicator"]')
    ).toBeInTheDocument()
  })

  it('renders Libraries link with beta indicator', () => {
    render(<SidebarNav />)

    const chatLinks = screen.getAllByTestId('sidebar-nav-link')
    const librariesLink = chatLinks.find(
      (link) => link.getAttribute('data-href') === '/libraries'
    )

    expect(librariesLink).toHaveAttribute('data-beta', 'true')
    expect(
      librariesLink?.querySelector('[data-testid="beta-indicator"]')
    ).toBeInTheDocument()
  })

  it('renders Connections link with beta indicator', () => {
    render(<SidebarNav />)

    const chatLinks = screen.getAllByTestId('sidebar-nav-link')
    const connectionsLink = chatLinks.find(
      (link) => link.getAttribute('data-href') === '/connections'
    )

    expect(connectionsLink).toHaveAttribute('data-beta', 'true')
    expect(
      connectionsLink?.querySelector('[data-testid="beta-indicator"]')
    ).toBeInTheDocument()
  })

  it('renders correct href for each link', () => {
    render(<SidebarNav />)

    const links = screen.getAllByTestId('sidebar-nav-link')

    expect(
      links.find((link) => link.getAttribute('data-href') === '/chat')
    ).toBeInTheDocument()
    expect(
      links.find((link) => link.getAttribute('data-href') === '/agents')
    ).toBeInTheDocument()
    expect(
      links.find((link) => link.getAttribute('data-href') === '/libraries')
    ).toBeInTheDocument()
    expect(
      links.find((link) => link.getAttribute('data-href') === '/connections')
    ).toBeInTheDocument()
  })

  it('renders all links in correct order', () => {
    render(<SidebarNav />)

    const links = screen.getAllByTestId('sidebar-nav-link')

    expect(links[0]).toHaveAttribute('data-href', '/chat')
    expect(links[1]).toHaveAttribute('data-href', '/agents')
    expect(links[2]).toHaveAttribute('data-href', '/libraries')
    expect(links[3]).toHaveAttribute('data-href', '/connections')
  })

  it('renders exactly 4 navigation links', () => {
    render(<SidebarNav />)

    const links = screen.getAllByTestId('sidebar-nav-link')
    expect(links).toHaveLength(4)
  })
})
