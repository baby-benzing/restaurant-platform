import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OperatingHours } from '../OperatingHours';

describe('OperatingHours', () => {
  const mockHours = [
    { dayOfWeek: 0, openTime: '17:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 1, openTime: '17:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 2, openTime: '17:00', closeTime: '23:00', isClosed: false },
    { dayOfWeek: 3, openTime: '17:00', closeTime: '00:00', isClosed: false },
    { dayOfWeek: 4, openTime: '17:00', closeTime: '00:00', isClosed: false },
    { dayOfWeek: 5, openTime: '17:00', closeTime: '01:00', isClosed: false },
    { dayOfWeek: 6, openTime: '17:00', closeTime: '01:00', isClosed: false },
  ];

  it('should render all days of the week', () => {
    render(<OperatingHours hours={mockHours} />);
    
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('Wednesday')).toBeInTheDocument();
    expect(screen.getByText('Thursday')).toBeInTheDocument();
    expect(screen.getByText('Friday')).toBeInTheDocument();
    expect(screen.getByText('Saturday')).toBeInTheDocument();
  });

  it('should format times correctly', () => {
    render(<OperatingHours hours={mockHours} />);
    
    expect(screen.getByText('5:00 PM - 11:00 PM')).toBeInTheDocument();
    expect(screen.getByText('5:00 PM - 12:00 AM')).toBeInTheDocument();
    expect(screen.getByText('5:00 PM - 1:00 AM')).toBeInTheDocument();
  });

  it('should show closed days', () => {
    const hoursWithClosed = [
      ...mockHours.slice(0, 1),
      { dayOfWeek: 1, openTime: '', closeTime: '', isClosed: true },
    ];
    
    render(<OperatingHours hours={hoursWithClosed} />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('should highlight today when showToday is true', () => {
    const today = new Date().getDay();
    render(<OperatingHours hours={mockHours} showToday />);
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayElement = screen.getByText(days[today]);
    const parent = todayElement.closest('div');
    
    expect(parent).toHaveClass('font-semibold');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <OperatingHours hours={mockHours} className="custom-hours" />
    );
    
    expect(container.firstChild).toHaveClass('custom-hours');
  });

  it('should render with title when provided', () => {
    render(<OperatingHours hours={mockHours} title="Store Hours" />);
    expect(screen.getByText('Store Hours')).toBeInTheDocument();
  });

  it('should handle empty hours array', () => {
    render(<OperatingHours hours={[]} />);
    expect(screen.getByText('Hours not available')).toBeInTheDocument();
  });

  it('should use compact format when specified', () => {
    render(<OperatingHours hours={mockHours} compact />);
    
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.queryByText('Sunday')).not.toBeInTheDocument();
  });

  it('should group consecutive days with same hours', () => {
    const sameHours = [
      { dayOfWeek: 0, openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 1, openTime: '09:00', closeTime: '17:00', isClosed: false },
      { dayOfWeek: 2, openTime: '09:00', closeTime: '17:00', isClosed: false },
    ];
    
    render(<OperatingHours hours={sameHours} groupSimilar />);
    expect(screen.getByText('Sunday - Tuesday')).toBeInTheDocument();
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
  });
});