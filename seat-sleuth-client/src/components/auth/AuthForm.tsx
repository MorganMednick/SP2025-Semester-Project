import { TextInput, PasswordInput, Button, Stack, Image } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthState } from '../../types/clitentAuth';
import { slothLogoWithText } from '../../util/assetReconcileUtil';
import { useAuth } from '../../context/authContext';
import { AuthPayload } from '@shared/api/payloads';
import { modals } from '@mantine/modals';
import { useMutation } from 'react-query';
import { showMantineNotification } from '../../util/uiUtils';

interface AuthFormProps {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

export default function AuthForm({ authState, setAuthState }: AuthFormProps) {
  const { login, register } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: (value: string) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value: string) =>
        value.length < 6 ? 'Password must be at least 6 characters' : null,
      confirmPassword: (value: string, values) =>
        authState === AuthState.REGISTER && value !== values.password
          ? 'Passwords do not match'
          : null,
    },

    validateInputOnChange: ['email', 'confirmPassword'],
  });

  const loginMutation = useMutation(
    ({ email, password }: AuthPayload) => login({ email, password }),
    {
      onSuccess: () => {
        modals.closeAll();
      },
      onError: (err: Error) => {
        showMantineNotification({ message: err.message, type: 'ERROR', position: 'top-center' });
      },
    },
  );

  const registerMutation = useMutation(
    ({ email, password }: AuthPayload) => register({ email, password }),
    {
      onSuccess: () => {
        modals.closeAll();
      },
      onError: (err: Error) => {
        showMantineNotification({ message: err.message, type: 'ERROR', position: 'top-center' });
      },
    },
  );

  const handleSubmit = (values: typeof form.values) => {
    const { email, password }: AuthPayload = values;
    if (authState === AuthState.LOGIN) {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ email, password });
    }
  };

  const isLoading =
    authState === AuthState.LOGIN ? loginMutation.isLoading : registerMutation.isLoading;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="lg" align="center" p={8}>
        <Image src={slothLogoWithText} w="90%" />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          {...form.getInputProps('email')}
          required
          error={form.errors.email}
          w="90%"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
          required
          w="90%"
        />

        {authState === AuthState.REGISTER && (
          <PasswordInput
            w="90%"
            label="Confirm Password"
            placeholder="Re-enter your password"
            {...form.getInputProps('confirmPassword')}
            required
          />
        )}

        <Button type="submit" w="90%" loading={isLoading}>
          {authState === AuthState.LOGIN ? 'Login' : 'Register'}
        </Button>

        <Button
          variant="subtle"
          w="90%"
          onClick={() =>
            setAuthState(authState === AuthState.LOGIN ? AuthState.REGISTER : AuthState.LOGIN)
          }
        >
          {authState === AuthState.LOGIN
            ? 'Need an account? Register'
            : 'Already have an account? Login'}
        </Button>
      </Stack>
    </form>
  );
}
