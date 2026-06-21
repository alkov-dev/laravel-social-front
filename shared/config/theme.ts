import { createTheme } from '@mantine/core';


export const mantineTheme = createTheme({
    primaryColor: 'cyan',
    defaultRadius: 'md',
    colors: {
        cyan: [
            '#e0f7ff',
            '#b3ecff',
            '#80dfff',
            '#4dd2ff',
            '#26c6ff',
            '#00bfff',
            '#00a8e6',
            '#0091cc',
            '#007ab3',
            '#006399',
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