import Image from 'next/image'
import React from 'react'

export default function Logo() {
    return (
        <div className="flex justify-center mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <div><Image src={"https://i.ibb.co/0p3gk3sh/logo.png"} alt='logo' width={200} height={200} /></div>
            </div>
        </div>
    )

}
