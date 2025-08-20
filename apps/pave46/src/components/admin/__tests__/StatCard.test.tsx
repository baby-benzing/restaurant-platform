import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renders title and value correctly', () => {
    render(
      <StatCard title="Test Metric" value="1,234" />
    );
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders increase change indicator correctly', () => {
    render(
      <StatCard 
        title="Revenue" 
        value="$10,000"
        change={{ value: 15.5, type: 'increase' }}
      />
    );
    
    expect(screen.getByText('↑15.5%')).toBeInTheDocument();
    expect(screen.getByText('↑15.5%')).toHaveClass('text-green-600');
    expect(screen.getByText('from last month')).toBeInTheDocument();
  });

  it('renders decrease change indicator correctly', () => {
    render(
      <StatCard 
        title="Costs" 
        value="$5,000"
        change={{ value: 8.2, type: 'decrease' }}
      />
    );
    
    expect(screen.getByText('↓8.2%')).toBeInTheDocument();
    expect(screen.getByText('↓8.2%')).toHaveClass('text-red-600');
  });

  it('renders neutral change indicator correctly', () => {
    render(
      <StatCard 
        title="Users" 
        value="100"
        change={{ value: 0, type: 'neutral' }}
      />
    );
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toHaveClass('text-neutral-600');
  });

  it('renders icon when provided', () => {
    render(
      <StatCard 
        title="Views" 
        value="500"
        icon={<span data-testid="test-icon">👀</span>}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatCard 
        title="Test" 
        value="123"
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});