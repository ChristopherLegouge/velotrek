import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'

const mockSignIn  = vi.fn().mockResolvedValue({ error: null })
const mockOAuth   = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signInWithOAuth:    mockOAuth,
    },
  }),
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
  })

  it('shows error when fields are empty and form is submitted', async () => {
    render(<LoginForm />)
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }))
    expect(screen.getByText(/email requis/i)).toBeInTheDocument()
  })

  it('calls signInWithPassword with correct credentials', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email:    'test@example.com',
        password: 'password123',
      })
    })
  })
})
