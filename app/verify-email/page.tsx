import React, { Suspense } from 'react'
import VerifyEmail from './components/VerifyEmail'
import { Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div><Loader2 className="w-4 h-4 animate-spin text-red-500" /></div>}>
            <VerifyEmail />
        </Suspense>
    )
}
