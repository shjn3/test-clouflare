'use client'
import { AUTH_ROUTES } from "@/const/routes";
import { SafeDev, UserRole } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVS } from '../../data/navs';
import LayoutStyle from './layout.module.css';

interface ItemDataType {
    key: string
    label: string;
    emoji: string;
}

const SideBarItem = ({
    itemData,
    role,
    isActive
}: {
    itemData: ItemDataType,
    role: UserRole,
    isActive?: boolean
}) => {
    return <Link href={`${AUTH_ROUTES[role]}/${itemData.key}`}>
        <div className={"sb-item" + (isActive ? ' active' : '')} id={"sb-" + itemData.key} >
            <span className="sb-icon">{itemData.emoji}</span> {itemData.label}
        </div>
    </Link>
}

const MainNav = ({
    items,
    currentPage,
    role
}: {
    items: ItemDataType[],
    currentPage: string,
    role: UserRole
}) => {
    return <>
        <div className="sb-label">Admin</div>
        {
            items.slice(0, 7).map((b, i) =>
                <SideBarItem key={i} itemData={b} isActive={b.key == currentPage} role={role} />
            )
        }
        <div className="sb-sep"></div>
        <div className="sb-label">Resources</div>
        {
            items.slice(7,).map((b, i) => <SideBarItem key={i} itemData={b} isActive={b.key == currentPage} role={role} />
            )
        }</>
}

const getPageName = (pathName:string)=>{
return pathName.slice(pathName.lastIndexOf('/')+1);
}


export default ({ profile }: { profile: SafeDev }) => {
    const currentPage = getPageName(usePathname());
    return <aside className={"sidebar" + ` ${LayoutStyle['sidebar']}`} id="sidebar">
        {profile.role == 'developer' && <div id="devNav">
            <MainNav items={NAVS.dev} currentPage={currentPage} role={profile.role ?? "developer"} />
        </div>
        }
        {profile.role == 'admin' && <div id="adminNav">
            <MainNav items={NAVS.admin} currentPage={currentPage} role={profile.role ?? "developer"} />
        </div>}
        <div className="sb-bottom">
            <div className="sb-sep"></div>
            <div className="sb-item" onClick={() => window.open('https://gami.com', '_blank')}>
                <span className="sb-icon">🌐</span> View Public Site
            </div>
        </div>
    </aside >
}