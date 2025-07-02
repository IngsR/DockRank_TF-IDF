import type { Metadata } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://www.doc-rank-explorer.com'),

    title: {
        default: 'DocRank Explorer | Analisis dan Peringkasan Dokumen Cerdas',
        template: `%s | DocRank Explorer`,
    },
    description:
        'Temukan informasi lebih cepat dengan DocRank Explorer. Aplikasi pencarian cerdas yang mampu menganalisis, memberi peringkat, dan meringkas dokumen Anda secara efisien.',

    keywords: [
        'pencarian dokumen',
        'analisis dokumen',
        'information retrieval',
        'peringkat dokumen',
        'summary generator',
    ],

    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    openGraph: {
        title: 'DocRank Explorer | Analisis dan Peringkasan Dokumen Cerdas',
        description:
            'Temukan informasi lebih cepat dengan aplikasi pencarian cerdas kami.',
        url: 'https://www.doc-rank-explorer.com',
        siteName: 'DocRank Explorer',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Tampilan Aplikasi DocRank Explorer',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'DocRank Explorer | Analisis dan Peringkasan Dokumen Cerdas',
        description:
            'Temukan informasi lebih cepat dengan aplikasi pencarian cerdas kami.',
        images: ['/og-image.png'], // Gunakan gambar yang sama dengan openGraph
    },

    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};
