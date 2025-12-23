/* =========================================================
   RESUME DOMAIN
========================================================= */

export interface ResumeData {
	info: PersonalInfo;
	theme?: ResumeTheme;
	ats?: AtsConfig;
	social_networks?: SocialNetwork[];
	personal_statement?: string;
	sections: ResumeSections;
}

/* ---------- Meta ---------- */

export type ResumeTheme = 'classic' | 'modern' | 'contrast';

export interface AtsConfig {
	keywords?: string[];
}

/* ---------- Personal ---------- */

export interface PersonalInfo {
	name: string;
	title: string;
	mobile?: string;
	email?: string;
	website?: string;
	address?: string;
	gender?: 'Male' | 'Female' | 'Other' | string;
}

/* ---------- Social ---------- */

export interface SocialNetwork {
	platform: string;
	username: string;
}

/* ---------- Sections ---------- */

export interface ResumeSections {
	experiences?: Experience[];
	education?: Education[];
	projects?: Project[];
	skills?: SkillGroup[];
	languages?: Language[];
	awards?: Award[];
	certifications?: Certification[];
	publications?: Publication[];
	references?: Reference[];
}

/* ---------- Common ---------- */

export type DateString = `${number}-${number}` | 'Present' | string;

/* ---------- Experience ---------- */

export interface Experience {
	company: string;
	position: string;
	start_date?: DateString;
	end_date?: DateString;
	highlights?: string[];
}

/* ---------- Education ---------- */

export interface Education {
	institution: string;
	degree: string;
	start_date?: DateString;
	end_date?: DateString;
	highlights?: string[];
}

/* ---------- Project ---------- */

export interface Project {
	name: string;
	description: string;
	link?: string;
}

/* ---------- Skills ---------- */

export interface SkillGroup {
	name: string;
	keywords?: string[];
}

/* ---------- Language ---------- */

export interface Language {
	name: string;
	proficiency?: 'Basic' | 'Intermediate' | 'Fluent' | 'Native' | string;
}

/* ---------- Award ---------- */

export interface Award {
	title: string;
	issuer?: string;
	date?: DateString;
	description?: string;
}

/* ---------- Certification ---------- */

export interface Certification {
	name: string;
	issuer?: string;
	date?: DateString;
}

/* ---------- Publication ---------- */

export interface Publication {
	title: string;
	publisher?: string;
	date?: DateString;
	link?: string;
}

/* ---------- Reference ---------- */

export interface Reference {
	name: string;
	position?: string;
	contact?: string;
}

/* =========================================================
   PDF DOMAIN (pdfmake-aligned)
========================================================= */

export type Margin =
	| [number, number, number, number]
	| [number, number]
	| number;

/* ---------- Text ---------- */

export type PdfInlineText =
	| string
	| {
			text: string;
			bold?: boolean;
			italics?: boolean;
			color?: string;
			link?: string;
	  };

export interface PdfText {
	text: string | PdfInlineText[];
	style?: string | string[];
	fontSize?: number;
	color?: string;
	bold?: boolean;
	italics?: boolean;
	link?: string;
	margin?: Margin;
}

/* ---------- Lists ---------- */

export interface PdfList {
	ul: PdfContent[];
	margin?: Margin;
}

/* ---------- Tables ---------- */

export interface PdfTable {
	table: {
		widths: Array<string | number>;
		body: PdfContent[][];
	};
	layout?: 'noBorders' | string;
	margin?: Margin;
}

/* ---------- Canvas ---------- */

export interface PdfCanvasLine {
	type: 'line';
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	lineWidth?: number;
	lineColor?: string;
}

export interface PdfCanvas {
	canvas: PdfCanvasLine[];
	margin?: Margin;
}

/* ---------- Generic Node ---------- */

export interface PdfNode {
	stack?: PdfContent[];
	text?: PdfText['text'];
	style?: PdfText['style'];
	margin?: Margin;
	link?: string;
	fontSize?: number;
	color?: string;
	svg?: string;
}

/* ---------- Union ---------- */

export type PdfContent = PdfText | PdfList | PdfTable | PdfCanvas | PdfNode;
