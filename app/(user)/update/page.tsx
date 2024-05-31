"use client"
import { Button } from '@/components/button'
import { Card } from '@/components/card'
import { InputField } from '@/components/inputField'
import { session } from '@/lib/auth'
import { profileUpdateSchema } from '@/lib/zodschema'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { chechExistingUser } from '@/lib/utils'

export default function Page() {
    const { data }: { data: session } = useSession();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    useEffect(() => {
        if (data?.user) {
            setFormData(prev => ({
                ...prev,
                email: data.user.email,
                name: data.user.name,
            }));
        }
    }, [data]);

    useEffect(() => {
        if (data?.user?.email) {
            chechExistingUser(data.user.email).then(user => {
                if (user?.email) {
                    router.push('/');
                }
            });
        }
    }, [data, router]);

    const handleSubmit = async () => {
        const response = profileUpdateSchema.safeParse(formData);

        if (!response.success) {
            const errorObj = response.error.issues.reduce((acc, issue) => {
                acc[issue.path.join('.')] = issue.message;
                return acc;
            }, {});
            setErrors(errorObj);
            return;
        }

        setErrors({});
        const bodyData = {
            ...response.data,
            email: data.user.email,
            avatar: data.user.image,
            authType: data.user.authType,
        };

        try {
            const res = await fetch('/api/update', {
                method: 'POST',
                body: JSON.stringify(bodyData)
            });
            const resData = await res.json();
            alert(resData.msg || 'Your data has been successfully updated!');
            if (resData?.id) {
                router.push('/');
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    if (!data?.user) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <div className='grid grid-cols-1 md:grid-cols-3'>
                <Card classes='md:col-span-2 md:order-first'>
                    {['email', 'username', 'name', 'password', 'confirmPassword'].map(field => (
                        <>
                            <InputField
                                key={field}
                                id={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                type={field.includes('password') ? 'password' : 'text'}
                                value={formData[field]}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                isDisable={field === 'email'}
                                onChange={value => setFormData(prev => ({ ...prev, [field]: value }))}
                            />
                            {Object.keys(errors)
                                .filter(errorKey => errorKey === field)
                                .map(errorKey => (
                                    <div key={errorKey} className="text-red-500">{errors[errorKey]}</div>
                                ))}
                        </>
                    ))}
                </Card>
                <div className='flex justify-center items-center p-3 order-first'>
                    <Image src={data.user.image || ''} alt="profile image" width={200} height={200} className='rounded-full' />
                </div>
            </div>
            <div className='m-2'>
                <input
                    type="checkbox"
                    id='agreeToTerms'
                    className='mr-1'
                    checked={formData.agreeToTerms}
                    onChange={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                />
                <label htmlFor="agreeToTerms">I agreed to terms and conditions</label>
                {errors.agreeToTerms && <div className="text-red-500">{errors.agreeToTerms}</div>}
            </div>
            {formData.agreeToTerms && <div className='flex justify-center mt-5'>
                <Button onclick={handleSubmit}>Save</Button>
            </div>}
        </Card>
    );
}
