export interface Profile {
    id: string;
    name: string;
}

export interface Fee {
    id: string;
    name: string;
    amount: number;
    type: 'fixed' | 'percentage' | 'per-sale' | 'unique';
    isActive: boolean;
}

export interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    isCompleted: boolean;
}

export interface Sale {
    id: string;
    amount: number; // Return
    investedAmount: number; // Ads
    applyFees: boolean;
    saleDate: string; // ISO string
}

export interface PendingInvestment {
    id: string;
    investedAmount: number;
    registeredDate: string; // ISO string
    isResolved: boolean;
}

export interface ProfileData {
    profile: Profile;
    fees: Fee[];
    goals: Goal[];
    sales: Sale[];
    pendingInvestments: PendingInvestment[];
    dailyRegistration?: string; // e.g., "2026-02-27 - Escala Manhã"
}

export interface AllProfileData {
    [profileId: string]: ProfileData;
}
