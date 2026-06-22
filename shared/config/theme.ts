import { createTheme } from '@mantine/core';


export const mantineTheme = createTheme({
    primaryColor: 'grape',
    defaultRadius: 'md',
    colors: {
        violet: [
            '#f3f0ff', // violet-0
            '#e5dbff', // violet-1
            '#d0bfff', // violet-2
            '#b197fc', // violet-3
            '#9775fa', // violet-4
            '#845ef7', // violet-5
            '#7950f2', // violet-6
            '#7048e8', // violet-7
            '#6741d9', // violet-8
            '#5f3dc4', // violet-9
        ],
    },
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    headings: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        fontWeight: '700',
    },
    components: {
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
        Card: {
            defaultProps: {
                radius: 'md',
                withBorder: true,
            },
        },
    },
});