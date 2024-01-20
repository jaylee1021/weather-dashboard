"use client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export default function Providers({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <> {children} </>;

    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}

// import * as React from 'react';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// export default function Providers({ children }) {
//     const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

//     const theme = React.useMemo(
//         () =>
//             createTheme({
//                 palette: {
//                     mode: prefersDarkMode ? 'dark' : 'light',
//                 },
//             }),
//         [prefersDarkMode],
//     );

//     return (
//         <ThemeProvider theme={theme}>
//             <CssBaseline />
//             {children}
//         </ThemeProvider>
//     );
// }
