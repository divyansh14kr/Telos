import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const express = require('express')
const app = use(express)
const PORT = 3000 || process.env.PORT


app.post("/login", (req,res)=>{
    console.log(req.body.params)

})

