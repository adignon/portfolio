import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					{/* PWA primary color */}
					<link rel="shortcut icon" href="/static/favicon.ico" />

				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}