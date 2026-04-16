import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';
import { useHeaderScroll } from '@/hooks/use-header-scroll';

// Mock the hook
jest.mock('@/hooks/use-header-scroll', () => ({
  useHeaderScroll: jest.fn(),
}));

// Mock child components to keep tests focused on Header logic
jest.mock('../HeaderLogo', () => ({
  HeaderLogo: () => <div data-testid="header-logo" />,
}));
jest.mock('../HeaderNav', () => ({
  HeaderNav: () => <div data-testid="header-nav" />,
}));
jest.mock('../HeaderMobileMenu', () => ({
  HeaderMobileMenu: ({ isOpen }: { isOpen: boolean }) => (
    isOpen ? <div data-testid="header-mobile-menu" /> : null
  ),
}));
jest.mock('../CartButton', () => ({
  CartButton: () => <div data-testid="cart-button" />,
}));

describe('Header Component', () => {
  beforeEach(() => {
    (useHeaderScroll as jest.MockedFunction<typeof useHeaderScroll>).mockReturnValue(false);
  });

  it('renders correctly in initial state', () => {
    render(<Header />);
    expect(screen.getByTestId('header-logo')).toBeInTheDocument();
    expect(screen.getByTestId('header-nav')).toBeInTheDocument();
  });

  it('applies scrolled classes when page is scrolled', () => {
    (useHeaderScroll as jest.MockedFunction<typeof useHeaderScroll>).mockReturnValue(true);
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-[#020617]/70');
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    
    // Menu icon button (mobile only toggle)
    const toggleButton = screen.getByLabelText('Abrir menu');
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('header-mobile-menu')).toBeInTheDocument();
    
    // Close it
    fireEvent.click(screen.getByLabelText('Fechar menu'));
    expect(screen.queryByTestId('header-mobile-menu')).not.toBeInTheDocument();
  });
});
