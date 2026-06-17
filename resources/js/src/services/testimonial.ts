import { BaseApi } from "./baseApi";
import { ITestimonial } from "../types";

class TestimonialApi extends BaseApi<ITestimonial> {
    constructor() {
        super("/testimonials");
    }
}

export const testimonialApi = new TestimonialApi();
