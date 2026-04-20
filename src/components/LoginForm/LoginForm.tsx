'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { loginSchema, type TLoginFormValues } from '#schemas/auth.schemas';
import { continueAsGuest, clearGuestCookie } from '../../../app/actions';

const LoginForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginFormValues) => {
    setServerError(null);

    const result = await signIn('credentials', { ...data, redirect: false });

    if (result.error) {
      setServerError('Invalid email or password');
    } else {
      await clearGuestCookie();
      router.push('/premium-bonds/interest-tracker');
    }
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
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Track your Premium Bond interest rate
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
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
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
                Sign in
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>or</Divider>

          <Stack spacing={2}>
            <form action={continueAsGuest}>
              <Button type="submit" variant="outlined" fullWidth sx={{ height: 48 }}>
                Continue as guest
              </Button>
            </form>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              No account?{' '}
              <Link component={NextLink} href="/register">
                Create one
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
