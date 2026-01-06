"use client"

import dynamic from 'next/dynamic'

const ClientSpecialComponent = dynamic(
  () => import('../../../../components/ClientSpecialComponent'),
  { ssr: false }
)


export default function Home() {
	


	return(
		<main className="h-full w-full bg-[#1f1f1f]">
			
			<ClientSpecialComponent />
		</main>
	)
}