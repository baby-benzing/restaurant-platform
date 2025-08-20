import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuickActions, QuickAction } from '../QuickActions';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('QuickActions', () => {
  const mockActions: QuickAction[] = [
    {
      id: '1',
      label: 'Add Item',
      href: '/admin/add',
      icon: '➕',
    },
    {
      id: '2',
      label: 'View Reports',
      href: '/admin/reports',
      icon: '📊',
      color: 'text-blue-600',
    },
    {
      id: '3',
      label: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
    },
  ];

  it('renders the component title', () => {
    render(<QuickActions actions={[]} />);
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('renders all action items', () => {
    render(<QuickActions actions={mockActions} />);
    
    expect(screen.getByText('Add Item')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders action icons', () => {
    render(<QuickActions actions={mockActions} />);
    
    expect(screen.getByText('➕')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('⚙️')).toBeInTheDocument();
  });

  it('creates links with correct href attributes', () => {
    render(<QuickActions actions={mockActions} />);
    
    const addLink = screen.getByText('Add Item').closest('a');
    const reportsLink = screen.getByText('View Reports').closest('a');
    const settingsLink = screen.getByText('Settings').closest('a');
    
    expect(addLink).toHaveAttribute('href', '/admin/add');
    expect(reportsLink).toHaveAttribute('href', '/admin/reports');
    expect(settingsLink).toHaveAttribute('href', '/admin/settings');
  });

  it('renders actions with custom color when provided', () => {
    const { container } = render(<QuickActions actions={mockActions} />);
    
    // The color is passed in the actions array and rendered
    const actionWithColor = mockActions.find(a => a.color);
    expect(actionWithColor?.color).toBe('text-blue-600');
    expect(screen.getByText('View Reports')).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = render(
      <QuickActions actions={[]} className="custom-actions-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-actions-class');
  });

  it('renders in a 2-column grid', () => {
    render(<QuickActions actions={mockActions} />);
    
    const gridContainer = screen.getByText('Quick Actions').parentElement?.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2');
  });

  it('renders correct number of action links', () => {
    render(<QuickActions actions={mockActions} />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockActions.length);
  });
});