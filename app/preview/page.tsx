import { Suspense } from "react"
import DashboardPage from "./dashPage"

export default function MainPage() {
    return (
        <>
        <Suspense>
        <DashboardPage/>
        </Suspense>
        </>
    )
}