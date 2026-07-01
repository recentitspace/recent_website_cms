import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { domainRequestApi } from "../../../services/domainRequest";
import { DomainRequestStatus } from "../../../types/domainRequest";

interface DomainRequestDetailProps {
    requestId: number | null;
}

const statusOptions: { value: DomainRequestStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "canceled", label: "Canceled" },
    { value: "completed", label: "Completed" },
];

const statusClass: Record<DomainRequestStatus, string> = {
    pending: "text-warning",
    contacted: "text-primary",
    canceled: "text-danger",
    completed: "text-success",
};

const DomainRequestDetail: React.FC<DomainRequestDetailProps> = ({ requestId }) => {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<DomainRequestStatus>("pending");

    const { data: request, isLoading } = useQuery({
        queryKey: ["domain-request", requestId],
        queryFn: () => (requestId ? domainRequestApi.getById(requestId) : null),
        enabled: !!requestId,
    });

    useEffect(() => {
        if (request?.status) {
            setStatus(request.status);
        }
    }, [request?.status]);

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: (nextStatus: DomainRequestStatus) =>
            domainRequestApi.update(requestId as number, { status: nextStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Domain Request Table"] });
            queryClient.invalidateQueries({ queryKey: ["domain-request", requestId] });
            toast.success("Request status updated");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update status");
        },
    });

    if (isLoading) {
        return null;
    }

    if (!request) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No request selected</p>
            </div>
        );
    }

    const fullDomain = request.full_domain || `${request.domain_name}${request.extension}`;

    return (
        <div className="space-y-4 text-sm">
            <div>
                <h3 className="text-xl font-bold break-all">{fullDomain}</h3>
                <p className={`mt-1 font-medium capitalize ${statusClass[request.status]}`}>
                    {request.status}
                </p>
            </div>

            <div>
                <span className="font-medium text-gray-500">Extension Price</span>
                <p>
                    ${request.extension_price}
                    {request.extension_period || "/yr"}
                </p>
            </div>

            <div>
                <span className="font-medium text-gray-500">Email</span>
                <a href={`mailto:${request.email}`} className="block break-all text-primary hover:underline">
                    {request.email}
                </a>
            </div>

            <div>
                <span className="font-medium text-gray-500">Phone</span>
                <a href={`tel:${request.phone}`} className="block break-all text-primary hover:underline">
                    {request.phone}
                </a>
            </div>

            <div>
                <span className="font-medium text-gray-500">Address</span>
                <p className="whitespace-pre-wrap break-words">{request.address}</p>
            </div>

            <div>
                <span className="font-medium text-gray-500">Requested</span>
                <p>{request.created_at ? new Date(request.created_at).toLocaleString() : "-"}</p>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <label className="mb-2 block font-medium text-gray-500">Update Status</label>
                <select
                    className="form-select w-full"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as DomainRequestStatus)}
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className="btn btn-primary mt-3 w-full"
                    disabled={isPending || status === request.status}
                    onClick={() => updateStatus(status)}
                >
                    {isPending ? "Saving..." : "Save Status"}
                </button>
            </div>
        </div>
    );
};

export default DomainRequestDetail;
