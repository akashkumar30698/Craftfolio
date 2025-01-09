import { Suspense } from "react"
import DashboardPage from "./dashPage"
import Loading from "../(main)/loading";


export default function MainPage() {
    return (
        <>
        <Suspense fallback={<Loading/>}>
        <DashboardPage/>
        </Suspense>
        </>
    )
}