<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import LanguageToggle from './language-toggle.svelte';
	import { getLocalization } from '$lib/i18n';
	const { t } = getLocalization();
</script>

<footer class="w-full py-4 px-6" style="background-color:#1E293B; border-top:1px solid #6366F133;">
	<div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
		<div class="flex flex-col md:flex-row items-center gap-3 text-sm text-center md:text-left" style="color:#CBD5E1;">
			<p>
				{@html $t('footer.self_ads', {
					mawoka_link: '<a href="https://mawoka.eu" target="_blank" style="color:#6366F1;text-decoration:underline;">Mawoka</a>',
					others_link: `<a href='/docs/attribution' style='color:#6366F1;text-decoration:underline;'>${$t('words.other', { count: 2 })}</a>`,
					interpolation: { escapeValue: false }
				})}
			</p>
			<span class="hidden md:inline">|</span>
			<p>
				Designupdate
				<a href="https://github.com/benhe84" target="_blank" style="color:#6366F1;text-decoration:underline;">benhe84</a>
			</p>
		</div>
		<LanguageToggle />
	</div>
</footer>
