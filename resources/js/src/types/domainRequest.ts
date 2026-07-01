export type DomainRequestStatus = 'pending' | 'contacted' | 'canceled' | 'completed';

export interface IDomainRequest {
    id: number;
    domain_name: string;
    extension: string;
    extension_price: string;
    extension_period: string;
    email: string;
    phone: string;
    address: string;
    status: DomainRequestStatus;
    full_domain?: string;
    created_at?: string;
    updated_at?: string;
}
