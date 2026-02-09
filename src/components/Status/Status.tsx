import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusProps {
    code: boolean;
    label?: string;
}

const Status: React.FC<StatusProps> = ({ code, label }) => {
    const getStatusColor = (code: boolean) => {
        switch (code) {
            // Draft - Neutral gray
            case true:
                return 'bg-green-500 text-black-200';
            
            // Submitted - Light blue (awaiting action)
            case false:
                return 'bg-red-400 text-white';
            
            
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <Badge className={`items-center ${getStatusColor(code)}`}>
            <span>{label}</span>
        </Badge>
    );
};

export default Status;