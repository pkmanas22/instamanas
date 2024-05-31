import { z } from "zod";

export const profileUpdateSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters long')
        .max(10, 'Username must be at most 10 characters long')
        .regex(/^[a-zA-Z0-9._]+$/, 'Username must be alphanumeric and can only contain (._)')
        .refine((val) => !/\s/.test(val), 'Username must be a single word without spaces'),

    name: z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(20, 'Name must be at most 20 characters long'),

    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password cannot be more than 16 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{6,16}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and no whitespace, and be between 6 and 16 characters" }),

    confirmPassword: z.string(),
    agreeToTerms: z.boolean()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
    })
    .refine(data => data.agreeToTerms === true, {
        message: "You must agree to the terms and conditions",
        path: ['agreeToTerms']
    });
