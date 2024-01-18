"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { FormGroup, FormControlLabel, Switch } from "@mui/material";


const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={theme === 'dark'}
                    onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
                label="Dark Mode"
            />
            {/* <div>
                The current theme is: {theme}
                <button onClick={() => setTheme('light')}>Light Mode</button>
                <button onClick={() => setTheme('dark')}>Dark Mode</button>
            </div> */}
        </FormGroup>
    );
};

export default ThemeSwitcher;