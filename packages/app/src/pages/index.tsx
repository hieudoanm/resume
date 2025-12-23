import { YAML_TEMPLATE } from '@resume/constants/app';
import { useDebounce } from '@resume/hooks/use-debounce';
import { yaml2pdfMake } from '@resume/services/yaml2pdfmake/yaml2pdfmake.service';
import { NextPage } from 'next';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useEffect, useMemo, useRef, useState } from 'react';

pdfMake.vfs = pdfFonts.vfs;

type ParseResult = { ok: true; doc: unknown } | { ok: false; error: string };

type Theme = 'light' | 'dark';

const HomePage: NextPage = () => {
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const [{ yaml }, setState] = useState<{ yaml: string }>({
		yaml: YAML_TEMPLATE,
	});

	const debouncedYaml = useDebounce(yaml, 500);

	/* ============================
	   THEME INIT (CLIENT ONLY)
	============================ */
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') return 'light';
		return (localStorage.getItem('theme') as Theme) ?? 'light';
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
		setTheme(nextTheme);
		localStorage.setItem('theme', nextTheme);
		document.documentElement.setAttribute('data-theme', nextTheme);
	};

	/* ============================
	   YAML VALIDATION (PURE)
	============================ */

	const parseResult: ParseResult = useMemo(() => {
		try {
			const doc = yaml2pdfMake(debouncedYaml);
			return { ok: true, doc };
		} catch (err) {
			return {
				ok: false,
				error: err instanceof Error ? err.message : 'Invalid YAML structure',
			};
		}
	}, [debouncedYaml]);

	/* ============================
	   PDF SIDE EFFECT
	============================ */

	useEffect(() => {
		if (!parseResult.ok) return;

		let cancelled = false;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		pdfMake.createPdf(parseResult.doc as any).getBlob((blob) => {
			if (cancelled) return;

			const url = URL.createObjectURL(blob);
			if (iframeRef.current) {
				iframeRef.current.src = url;
			}
		});

		return () => {
			cancelled = true;
		};
	}, [parseResult]);

	/* ============================
	   UI
	============================ */

	return (
		<div className="flex h-screen w-screen flex-col">
			<nav className="border-base-300 flex items-center justify-between border-b px-8 py-4 font-semibold">
				<span>Resume Builder</span>

				<button
					onClick={toggleTheme}
					className="btn btn-sm btn-base-300"
					title="Toggle theme">
					{theme === 'light' ? '🌙 Dark' : '☀️ Light'}
				</button>
			</nav>

			<div className="flex grow overflow-hidden">
				{/* YAML editor */}
				<div className="border-base-300 flex w-1/2 flex-col border-r">
					{!parseResult.ok && (
						<div className="border-error/30 bg-error/10 text-error border-b px-6 py-3 text-sm">
							<strong>YAML Error:</strong> {parseResult.error}
						</div>
					)}

					<textarea
						className={`grow resize-none px-6 py-4 font-mono text-sm outline-none ${
							!parseResult.ok ? 'bg-error/5' : ''
						}`}
						value={yaml}
						onChange={(e) =>
							setState((prev) => ({ ...prev, yaml: e.target.value }))
						}
						spellCheck={false}
					/>
				</div>

				{/* PDF preview */}
				<div className="bg-base-200 relative w-1/2">
					{!parseResult.ok && (
						<div className="bg-base-200/80 text-base-content/70 absolute inset-0 z-10 flex items-center justify-center text-sm">
							Fix YAML errors to update preview
						</div>
					)}

					<iframe
						ref={iframeRef}
						title="Resume Preview"
						className="h-full w-full"
					/>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
