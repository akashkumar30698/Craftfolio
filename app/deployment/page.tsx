"use client"

import React from 'react';
import { EnhancedDeploymentStepsCard } from './card';
import { Suspense } from 'react';


export default function DeploymentPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <Suspense>
              <EnhancedDeploymentStepsCard />
            </Suspense>
        </div>
    )
}