import React from "react";
import RoyalCard from "@/components/ui/RoyalCard";
import { Globe, Lock, ShieldCheck, ShieldAlert, PieChart } from "lucide-react";

interface SystemDistributionProps {
    published: number;
    draft: number;
    activeUsers: number;
    inactiveUsers: number;
    totalInvitations: number;
}

export default function SystemDistribution({
    published,
    draft,
    activeUsers,
    inactiveUsers,
    totalInvitations
}: SystemDistributionProps) {

    const invitationRate = totalInvitations > 0 ? (published / totalInvitations) * 100 : 0;
    const totalUsers = activeUsers + inactiveUsers;
    const activationRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    return (
        <RoyalCard className="h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif font-black text-xl text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                        <PieChart className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    Platform Insights
                </h3>
            </div>

            <div className="space-y-8">
                {/* Invitation Publishing Rate */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Globe className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">Deployment Rate</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{invitationRate.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${invitationRate}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>{published} Live</span>
                        <span>{draft} Draft</span>
                    </div>
                </div>

                {/* User Activation Rate */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-slate-600">User Onboarding</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{activationRate.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${activationRate}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>{activeUsers} Active</span>
                        <span>{inactiveUsers} Pending</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    * Statistik ini membantu memantau kualitas konversi pengguna dan publikasi konten di seluruh platform.
                </p>
            </div>
        </RoyalCard>
    );
}
