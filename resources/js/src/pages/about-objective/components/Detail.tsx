import { useQuery } from "@tanstack/react-query";
import React from "react";

import { aboutObjectiveApi } from "../../../services/aboutObjective";

interface DetailProps {
    objectiveId: number | null;
}

const Detail: React.FC<DetailProps> = ({ objectiveId }) => {
    const { data: objective, isLoading } = useQuery({
        queryKey: ["about-objective", objectiveId],
        queryFn: () => (objectiveId ? aboutObjectiveApi.getById(objectiveId) : null),
        enabled: !!objectiveId,
    });

    if (isLoading) {
        return null;
    }

    if (!objective) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No about objective selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold">{objective.title}</h3>
            </div>
            {objective.body && (
                <div>
                    <span className="font-medium text-gray-500">Description</span>
                    <p className="whitespace-pre-wrap">{objective.body}</p>
                </div>
            )}
            <div>
                <span className="font-medium text-gray-500">Display order</span>
                <p>{objective.sort_order}</p>
            </div>
            <div>
                <span className="font-medium text-gray-500">Active</span>
                <p>{objective.is_active ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};

export default Detail;
