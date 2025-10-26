import OutrightsPolitics from '@/components/Pages/Cycling/OutrightsPolitics'
import ParisRoubaixWinner from '@/components/Pages/Cycling/ParisRoubaixWinner'
import TourFlandersWinner from '@/components/Pages/Cycling/TourFlandersWinner'
import TourFranceWinner from '@/components/Pages/Cycling/TourFranceWinner'
import React from 'react'

export default function page() {
    return (
        <>
            <OutrightsPolitics />
            <TourFranceWinner />
            <ParisRoubaixWinner />
            <TourFlandersWinner />
        </>
    )
}
