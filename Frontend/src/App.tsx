import { useState } from 'react';
import './App.css';
import { LoginForm } from './components/middleware/login';
import { SignupForm } from './components/middleware/signup';
import { Homepage } from './components/middleware/Homepage';
import TelosValues from './components/middleware/ValueBoard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Menu, MenuItem, HoveredLink } from './components/ui/navbar-menu';
import Diary from './components/middleware/Diary'
import '/Users/divyanshkumar/Documents/code/Telos/Frontend/src/components/middleware/styles.scss'

const Navbar = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="w-full px-2 py-1 shadow-sm sticky top-0 z- bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
      <Menu setActive={setActive}>
        <div className="flex justify-between w-full items-center">
          {/* Left-aligned items */}
          <div className="flex space-x-4">
            <MenuItem item="Home" active={active} setActive={setActive}>
              <div className="flex flex-col space-y-2">
                <HoveredLink href="/">Go to Home</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem item="Diary/Values" active={active} setActive={setActive}>
              <div className="flex flex-col space-y-1">
                <HoveredLink href="/diary">My Diary</HoveredLink>
                <HoveredLink href="/home">Core Values</HoveredLink>
              </div>
            </MenuItem>
          </div>


          <div className="flex space-x-4">
            <MenuItem item="Account" active={active} setActive={setActive}>
              <div className="flex flex-col space-y-2">
                <HoveredLink href="/login">Login</HoveredLink>
                <HoveredLink href="/signup">Sign Up</HoveredLink>
              </div>
            </MenuItem>
          </div>
        </div>
      </Menu>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<TelosValues />} />
        {/* Add this when Diary page exists */}
        <Route path="/diary" element={<Diary/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
