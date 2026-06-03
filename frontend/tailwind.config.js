// SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
// SPDX-License-Identifier: MPL-2.0
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				brand: {
					bg:        '#0F172A',
					card:      '#1E293B',
					primary:   '#6366F1',
					'primary-hover': '#818CF8',
					secondary: '#14B8A6',
					success:   '#22C55E',
					warning:   '#F59E0B',
					error:     '#EF4444',
					text:      '#F8FAFC',
					muted:     '#CBD5E1',
				}
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'code::before': { content: '""', 'padding-left': '0.25rem' },
						'code::after':  { content: '""', 'padding-right': '0.25rem' },
						code: {
							'padding-top': '0.25rem',
							'padding-bottom': '0.25rem',
							fontWeight: '400',
							color: theme('colors.brand.text'),
							'border-radius': '0.25rem',
							backgroundColor: theme('colors.brand.card')
						}
					}
				}
			})
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
module.exports = config;
