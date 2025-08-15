"use client"

import React from 'react';
import { Suspense } from 'react';
import Loading from '../../(main)/loading';
import DashboardPage from './DashMain';

export default function Page() {
    return (
            <Suspense fallback={<Loading/>}>
              <DashboardPage />
            </Suspense>
    )
}