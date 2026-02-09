import React from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import RoleManager from './role-management';

export const metadata: Metadata = {
    title: "Role | User Management",
    description:
        "Role management in the system",
};

const RolePage: React.FC = () => {
    return (
        <DefaultLayout>
            <Breadcrumb parentPage='User Management' pageName="Roles" />
            <div className="flex flex-col gap-2">
                <RoleManager/>
            </div>
        </DefaultLayout>

    );
};

export default RolePage;