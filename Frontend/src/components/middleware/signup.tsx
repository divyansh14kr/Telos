import { createClient } from '@supabase/supabase-js';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Initialize Supabase client (use environment variables)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Define the form schema with email included
const formSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    username: z.string().min(4).max(13),
    password: z
      .string({ required_error: 'Required' })
      .min(8, { message: 'Minimum 8 letters required' })
      .max(20, { message: 'Max length error' })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Lowercase letter required',
      })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Uppercase letter required',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Number required',
      })
      .refine((password) => /[!@#$^&*]/.test(password), {
        message: 'Special character required',
      }),
    confirmPassword: z
      .string({ required_error: 'Required' })
      .min(8, { message: 'Minimum 8 letters required' })
      .max(20, { message: 'Max length error' })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Lowercase letter required',
      })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Uppercase letter required',
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Number required',
      })
      .refine((password) => /[!@#$^&*]/.test(password), {
        message: 'Special character required',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, username } = values;
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      console.error('Signup error:', error.message);
      return;
    }
  
    console.log('Signup response:', data); // Debug
    const userId = data.user?.id;
    if (!userId) {
      console.error('No user ID returned from signup');
      return;
    }
  
    console.log('Inserting profile with userId:', userId); // Debug
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userId, username }]);
  
    if (profileError) {
      console.error('Error saving username:', profileError.message);
    } else {
      console.log('Signup successful!', data);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Google OAuth */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log('Google login success:', credentialResponse);
              // Optionally use supabase.auth.signInWithIdToken here
            }}
            onError={() => {
              console.error('Google login failed');
            }}
          />
        </GoogleOAuthProvider>

        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}