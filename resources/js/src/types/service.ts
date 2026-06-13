export type ServiceType = 'category' | 'service';
export type ServiceStatus = 'draft' | 'published';

export interface IServiceFeature {
    id?: number;
    service_id?: number;
    label: string;
    sort_order?: number;
    show_in_card?: boolean;
}

export interface IServiceProcessStep {
    id?: number;
    service_id?: number;
    step_number: number;
    title: string;
    description?: string | null;
    tasks?: string[];
    sort_order?: number;
}

export interface IServiceFaq {
    id?: number;
    service_id?: number;
    question: string;
    answer: string;
    sort_order?: number;
}

export interface IService {
    id: number;
    parent_id?: number | null;
    type: ServiceType;
    slug: string;
    name: string;
    short_name?: string | null;
    icon?: string | null;
    hero_image?: string | null;
    banner_title?: string | null;
    banner_subtitle?: string | null;
    hero_title?: string | null;
    hero_title_highlight?: string | null;
    hero_description?: string | null;
    section_title?: string | null;
    section_subtitle?: string | null;
    cta_text?: string | null;
    cta_url?: string | null;
    portfolio_category?: string | null;
    pricing_category_slug?: string | null;
    show_in_nav: boolean;
    show_on_homepage: boolean;
    sort_order: number;
    status: ServiceStatus;
    meta_title?: string | null;
    meta_description?: string | null;
    url?: string;
    parent?: IService | null;
    children?: IService[];
    features?: IServiceFeature[];
    process_steps?: IServiceProcessStep[];
    processSteps?: IServiceProcessStep[];
    faqs?: IServiceFaq[];
    created_at?: string;
    updated_at?: string;
}

export interface IServiceFormData extends Partial<IService> {
    features?: IServiceFeature[];
    process_steps?: IServiceProcessStep[];
    faqs?: IServiceFaq[];
}

export interface IServiceReorderItem {
    id: number;
    sort_order: number;
    parent_id?: number | null;
}
