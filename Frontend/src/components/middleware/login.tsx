

import { createClient } from '@supabase/supabase-js'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useState} from 'react'
import { useCookies } from 'react-cookie'





const formSchema = z.object({

    username : z.string().min(4).max(13),
    password : z.string({required_error: "Required"})
    .min(8, {message: 'Minimum 8 letters required'})
    .max(20,{message : "max Length Error"})
    .refine((password)=>/[a-z]/.test(password),{
        message :"lowercaseError",
    })
    .refine((password)=>/[A-Z]/.test(password),{
        message : "Upper case error",
    })
    .refine((password)=>/[0-9]/.test(password),{
        message : "Error no numbers included"
    })
    .refine((password)=>/[!@#$^&*]/.test(password),{
        message : "Error no special characters found"
    })
})


//const [cookie, setCookie, removeCookie] = useCookies('');


const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Login error:', error.message)
  } else {
    console.log('User logged in:', data)
  }
}







export function LoginForm(){

    const form =useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues :{
            username : "",
            password : "",
        }
    })

    function onSubmit(values : z.infer<typeof formSchema>){
          console.log(values)
    
    }
        return (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
<GoogleOAuthProvider clientId="process.env.clientId">
  <GoogleLogin
    onSuccess={credentialResponse => {
      console.log(credentialResponse);
    }}
    onError={() => {
      console.log('Login Failed');
    }}
  />
</GoogleOAuthProvider>

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          )
}