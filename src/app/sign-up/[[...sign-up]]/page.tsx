import { SignUp } from '@clerk/nextjs'

export default function SignUpForm() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<SignUp />
		</div>
	)
}