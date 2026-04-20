'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { registerSchema, type TRegisterFormValues } from '#schemas/auth.schemas';
import { clearGuestCookie } from '../../../app/actions';
import { localBondsStore } from '#store/localBondsStore';
import { addTransaction, addPrize } from '#api/bonds';

const API_ROOT = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/bonds', '') ?? '';

const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TRegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async ({ email, password }: TRegisterFormValues) => {
    setServerError(null);

    const res = await fetch(`${API_ROOT}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setServerError(body.error ?? 'Registration failed');
      return;
    }

    // Capture local data before signing in
    const localTransactions = localBondsStore.getTransactions();
    const localPrizes = localBondsStore.getPrizes();

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result.error) {
      setServerError('Account created but sign-in failed. Please sign in manually.');
      return;
    }

    if (localTransactions.length > 0 || localPrizes.length > 0) {
      const session = await getSession();
      const token = session?.backendToken ?? null;

      try {
        await Promise.all([
          ...localTransactions.map(({ date, amount, type }) =>
            addTransaction(token, { date, amount, type }),
          ),
          ...localPrizes.map(({ date, amount }) => addPrize(token, { date, amount })),
        ]);

        localBondsStore.clear();
      } catch {
        setServerError(
          'Account created, but your guest data could not be saved. Please add your entries again.',
        );
        return;
      }
    }

    await clearGuestCookie();
    router.push('/premium-bonds/interest-tracker');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start tracking your Premium Bond interest rate
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />
              <TextField
                label="Confirm password"
                type="password"
                fullWidth
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {serverError && (
                <Typography variant="body2" color="error">
                  {serverError}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                loading={isSubmitting}
                sx={{ height: 48 }}
              >
                Create account
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
            Already have an account?{' '}
            <Link component={NextLink} href="/login">
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterForm;
