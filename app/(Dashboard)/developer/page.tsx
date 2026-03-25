import { AUTH_ROUTES } from "@/const/routes"
import { redirect } from "next/navigation"

export default () => {
    return redirect(`${AUTH_ROUTES['developer']}/dashboard`)

}