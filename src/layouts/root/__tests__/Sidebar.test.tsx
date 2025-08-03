import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar from '../Sidebar'

// Mock the child components
jest.mock('../SidebarNav', () => {
  return function MockSidebarNav() {
    return <div data-testid="sidebar-nav">Navigation</div>
  }
})

jest.mock('../SidebarHistory', () => {
  return function MockSidebarHistory({ className }: { className?: string }) {
    return (
      <div data-testid="sidebar-history" className={className}>
        History
      </div>
    )
  }
})

describe('Sidebar', () => {
  it('renders SidebarNav component', () => {
    render(<Sidebar />)

    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
  })

  it('renders SidebarHistory component', () => {
    render(<Sidebar />)

    expect(screen.getByTestId('sidebar-history')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('passes mt-10 className to SidebarHistory', () => {
    render(<Sidebar />)

    const historyComponent = screen.getByTestId('sidebar-history')
    expect(historyComponent).toHaveClass('mt-10')
  })

  it('renders both components in correct order', () => {
    const { container } = render(<Sidebar />)

    const childElements = container.firstChild?.childNodes
    expect(childElements).toHaveLength(2)

    // First child should be SidebarNav
    expect(childElements?.[0]).toHaveAttribute('data-testid', 'sidebar-nav')
    // Second child should be SidebarHistory
    expect(childElements?.[1]).toHaveAttribute('data-testid', 'sidebar-history')
  })

  it('applies custom className when provided', () => {
    const { container } = render(<Sidebar className="custom-sidebar-class" />)

    expect(container.firstChild).toHaveClass('custom-sidebar-class')
  })

  it('renders without custom className', () => {
    const { container } = render(<Sidebar />)

    // Should still render with default classes
    expect(container.firstChild).toBeInTheDocument()
  })

  it('maintains layout structure', () => {
    const { container } = render(<Sidebar />)

    const sidebarElement = container.firstChild as HTMLElement
    expect(sidebarElement.tagName).toBe('DIV')

    // Should contain both nav and history components
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-history')).toBeInTheDocument()
  })

  it('handles empty className gracefully', () => {
    const { container } = render(<Sidebar className="" />)

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar-history')).toBeInTheDocument()
  })

  it('combines custom className with default classes', () => {
    const { container } = render(<Sidebar className="my-custom-class" />)

    const sidebarElement = container.firstChild as HTMLElement
    expect(sidebarElement.className).toContain('my-custom-class')
  })
})
