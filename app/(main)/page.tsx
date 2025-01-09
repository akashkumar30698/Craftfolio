

import { FormProvider } from "../context/formContext"
import { FormWrapper } from "../hooks/formWrapper"
import { DashboardSidebar } from "../preview/accordion"
import DeploymentPage from "../deployment/page"

export default function Main() {
    return (
        <>
        <FormProvider>
         <FormWrapper>
            <DashboardSidebar />
            <DeploymentPage />  
        </FormWrapper> 
        </FormProvider>
        </>
    )
}

