import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '../CartDrawer';
import { AppliedCoupon, CartStore, useCartStore } from '@/lib/store/cart-store';

// Mock the store
jest.mock('@/lib/store/cart-store', () => ({
  useCartStore: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in Jest
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt || ''} />
  ),
}));

describe('CartDrawer Component', () => {
  const mockSetOpen = jest.fn();
  const mockRemoveItem = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockTotalPrice = jest.fn(() => 100);
  const mockTotalItems = jest.fn(() => 1);

  const mockItems = [
    {
      id: '1',
      name: 'Test Product',
      price: 100,
      image: '/test.jpg',
      quantity: 1,
      stock: 10,
      sku: 'TEST-123',
      slug: 'test-product',
    },
  ];

  beforeEach(() => {
    (useCartStore as jest.MockedFunction<typeof useCartStore>).mockImplementation((selector : (state: CartStore) => unknown) => {
      const state: CartStore = {
        items: mockItems,
        customerName: 'Test User',
        isOpen: true,
        _hasHydrated: true,
        setHasHydrated: jest.fn(),
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: jest.fn(),
        setCustomerName: jest.fn(),
        toggleCart: jest.fn(),
        setOpen: mockSetOpen,
        totalItems: mockTotalItems,
        totalPrice: mockTotalPrice,
        appliedCoupon: null,
        applyCoupon: function (): void {
          throw new Error('Function not implemented.');
        },
        removeCoupon: function (): void {
          throw new Error('Function not implemented.');
        }
      };
      return selector(state);
    });
  });

  it('renders cart items when drawer is open', () => {
    render(<CartDrawer />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('SKU: TEST-123')).toBeInTheDocument();
  });

  it('shows empty state when no items are present', () => {
    (useCartStore as jest.MockedFunction<typeof useCartStore>).mockImplementation((selector: (state: CartStore) => unknown) => {
      const state: CartStore = {
        items: [],
        customerName: '',
        isOpen: true,
        _hasHydrated: true,
        setHasHydrated: jest.fn(),
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: jest.fn(),
        setCustomerName: jest.fn(),
        toggleCart: jest.fn(),
        setOpen: mockSetOpen,
        totalItems: () => 0,
        totalPrice: () => 0,
        appliedCoupon: null,
        applyCoupon: function (coupon: AppliedCoupon): void {
          throw new Error('Function not implemented.');
        },
        removeCoupon: function (): void {
          throw new Error('Function not implemented.');
        }
      };
      return selector(state);
    });

    render(<CartDrawer />);
    expect(screen.getByText('O carrinho está vazio')).toBeInTheDocument();
  });

  it('calls setOpen(false) when close button is clicked', () => {
    render(<CartDrawer />);
    const closeButton = screen.getByLabelText('Fechar carrinho');
    fireEvent.click(closeButton);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('calls updateQuantity when plus/minus buttons are clicked', () => {
    render(<CartDrawer />);
    const plusButton = screen.getByLabelText('Aumentar quantidade');
    fireEvent.click(plusButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
  });

  it('shows confirmation dialog when delete button is clicked', () => {
    render(<CartDrawer />);
    const deleteButton = screen.getByLabelText('Remover Test Product do carrinho');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Remover do pedido?')).toBeInTheDocument();
    
    const confirmButton = screen.getByText('Remover');
    fireEvent.click(confirmButton);
    
    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });

  it('disables checkout button if name is empty', () => {
    (useCartStore as jest.MockedFunction<typeof useCartStore>).mockImplementation((selector : (state: CartStore) => unknown) => {
      const state: CartStore = {
        items: mockItems,
        customerName: '',
        isOpen: true,
        _hasHydrated: true,
        setHasHydrated: jest.fn(),
        addItem: jest.fn(),
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: jest.fn(),
        setCustomerName: jest.fn(),
        toggleCart: jest.fn(),
        setOpen: mockSetOpen,
        totalItems: mockTotalItems,
        totalPrice: mockTotalPrice,
        appliedCoupon: null,
        applyCoupon: function (_coupon: AppliedCoupon): void {
          throw new Error('Function not implemented.');
        },
        removeCoupon: function (): void {
          throw new Error('Function not implemented.');
        }
      };
      return selector(state);
    });

    render(<CartDrawer />);
    const checkoutButton = screen.getByLabelText('Finalizar pedido pelo WhatsApp');
    expect(checkoutButton).toBeDisabled();
  });

  it('enables checkout button if name is provided', () => {
    render(<CartDrawer />);
    const checkoutButton = screen.getByLabelText('Finalizar pedido pelo WhatsApp');
    expect(checkoutButton).not.toBeDisabled();
  });
});
