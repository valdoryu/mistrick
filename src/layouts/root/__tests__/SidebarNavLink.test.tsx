import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SidebarNavLink from '../SidebarNavLink'
import { usePathname } from 'next/navigation'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock the Tag component
jest.mock('@/components/Tag', () => {
  return function MockTag({ label }: { label: string }) {
    return <div data-testid="tag">{label}</div>
  }
})

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

// Mock Icon component
const MockIcon = ({ className }: { className: string }) => (
  <div data-testid="icon" className={className}>
    Icon
  </div>
)

describe('SidebarNavLink', () => {
  beforeEach(() => {
    mockUsePathname.mockClear()
  })

  it('renders with label and icon', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarNavLink href="/chat" label="Chat" Icon={MockIcon} />)

    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders beta tag when is_beta is true', () => {
    mockUsePathname.mockReturnValue('/other')

    render(
      <SidebarNavLink href="/agents" label="Agents" Icon={MockIcon} is_beta />
    )

    expect(screen.getByTestId('tag')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('does not render beta tag when is_beta is false or undefined', () => {
    mockUsePathname.mockReturnValue('/other')

    render(<SidebarNavLink href="/chat" label="Chat" Icon={MockIcon} />)

    expect(screen.queryByTestId('tag')).not.toBeInTheDocument()
  })

  it('shows active state when pathname matches href', () => {
    mockUsePathname.mockReturnValue('/chat')

    render(<SidebarNavLink href="/chat" label="Chat" Icon={MockIcon} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('data-active', 'true')
  })

  it('shows inactive state when pathname does not match href', () => {
    mockUsePathname.mockReturnValue('/agents')

    render(<SidebarNavLink href="/chat" label="Chat" Icon={MockIcon} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('data-active', 'false')
  })

  it('has correct href attribute', () => {
    mockUsePathname.mockReturnValue('/other')

    render(
      <SidebarNavLink href="/libraries" label="Bibliothèques" Icon={MockIcon} />
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/libraries')
  })

  it('handles different labels correctly', () => {
    mockUsePathname.mockReturnValue('/other')

    render(
      <SidebarNavLink href="/connections" label="Connexions" Icon={MockIcon} />
    )

    expect(screen.getByText('Connexions')).toBeInTheDocument()
  })

  it('updates active state when pathname changes', () => {
    mockUsePathname.mockReturnValue('/chat')

    const { rerender } = render(
      <SidebarNavLink href="/chat" label="Chat" Icon={MockIcon} />
    )

    expect(screen.getByRole('link')).toHaveAttribute('data-active', 'true')

    // Simulate pathname change
    mockUsePathname.mockReturnValue('/agents')

    rerender(<SidebarNavLink href="/chat" label="Chat" Icon={MockIcon} />)

    expect(screen.getByRole('link')).toHaveAttribute('data-active', 'false')
  })
})
