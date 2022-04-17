import Head from 'next/head';
import "../styles/tailwind.css"
import 'swiper/css';
import "../styles/globals.css";
import "../styles/tailwind.css";
import { SessionProvider } from 'next-auth/react';



export default function MyApp(props:any) {
	const { 
		Component,
		pageProps:{layoutProps, ...pageProps}
	} = props;
	const getLayout=Component.getLayout ?? ((page:any)=>page)
	return (
		<>
			<Head>
				<meta 
          			name="viewport"
					content="initial-scale=1, width=device-width" 
        		/>
			</Head>
			<main>
				<SessionProvider>
					
				{getLayout(<Component {...pageProps} />, layoutProps)}
				</SessionProvider>
			</main>
		</>
	);
}