import { useQuery } from "@tanstack/react-query";
import React from "react";
import { statCounterApi } from "../../../services/statCounter";

interface StatCounterDetailProps {
    counterId: number | null;
}

const StatCounterDetail: React.FC<StatCounterDetailProps> = ({ counterId }) => {
    const { data: counter, isLoading } = useQuery({
        queryKey: ["stat-counter", counterId],
        queryFn: () => (counterId ? statCounterApi.getById(counterId) : null),
        enabled: !!counterId,
    });

    if (isLoading) {
        return null;
    }

    if (!counter) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No stat counter selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            {counter.icon?.url && (
                <img
                    src={counter.icon.url}
                    alt={counter.label}
                    className="max-h-24 rounded object-contain"
                />
            )}
            <div>
                <h3 className="text-xl font-bold">{counter.label}</h3>
            </div>
            <div>
                <span className="font-medium text-gray-500">Value</span>
                <p>
                    {counter.value}
                    {counter.suffix || ""}
                </p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Sort Order</span>
                <p>{counter.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{counter.is_active ? "Yes" : "No"}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Show on Home</span>
                <p>{counter.show_on_home ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default StatCounterDetail;
