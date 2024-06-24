"use client"
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { InputField } from '@/components/inputField';
import { profileUpdateSchema } from '@/lib/zodschema';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { chechExistingUser } from '@/lib/utils';

export default function Page() {
    const { data: sessionData, status: sessionStatus } = useSession();
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
        if (sessionData?.user) {
            setFormData(prev => ({
                ...prev,
                // @ts-ignore
                email: sessionData.user.email || '',
                // @ts-ignore
                name: sessionData.user.name || '',
            }));
        }
    }, [sessionData]);

    useEffect(() => {
        if (sessionData?.user?.email) {
            chechExistingUser(sessionData.user.email).then(user => {
                if (user?.email) {
                    router.push('/');
                }
            });
        }
    }, [sessionData, router]);

    const handleSubmit = async () => {
        const response = profileUpdateSchema.safeParse(formData);

        if (!response.success) {
            const errorObj = response.error.issues.reduce((acc, issue) => {
                acc[issue.path.join('.')] = issue.message;
                return acc;
            }, {} as Record<string, string>);
            setErrors(errorObj);
            return;
        }

        setErrors({});
        const bodyData = {
            ...response.data,
            email: sessionData?.user?.email,
            avatar: sessionData?.user?.image,
            // @ts-ignore
            authType: sessionData?.user?.authType,
        };

        try {
            const res = await fetch('/api/update', {
                method: 'POST',
                body: JSON.stringify(bodyData)
            });
            const resData = await res.json();
            if (resData.msg) {
                await alert(resData.msg);
                router.push('/');
            }
            alert(resData.error || 'Your data has been successfully updated!');
            if (resData?.id) {
                router.push('/');
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    if (sessionStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (sessionStatus === 'unauthenticated') {
        router.push('/api/auth/signin')
    }

    const formFields = [
        { id: 'email', label: 'Email', type: 'text', disabled: true },
        { id: 'username', label: 'Username', type: 'text', disabled: false },
        { id: 'name', label: 'Name', type: 'text', disabled: false },
        { id: 'password', label: 'Password', type: 'password', disabled: false },
        { id: 'confirmPassword', label: 'Confirm Password', type: 'password', disabled: false },
    ];

    return (
        <Card>
            <div className='grid grid-cols-1 md:grid-cols-3'>
                <Card classes='md:col-span-2 md:order-first'>
                    {formFields.map(({ id, label, type, disabled }) => (
                        <React.Fragment key={id}>
                            <InputField
                                id={id}
                                label={label}
                                type={type}
                                value={formData[id as keyof typeof formData]}
                                placeholder={label}
                                isDisable={disabled}
                                onChange={value => setFormData(prev => ({ ...prev, [id]: value }))}
                            />
                            {errors[id] && <div className="text-red-500">{errors[id]}</div>}
                        </React.Fragment>
                    ))}
                </Card>
                <div className='flex justify-center items-center p-3 order-first'>
                    <Image src={sessionData?.user?.image || 'https://instamanas.s3.ap-south-1.amazonaws.com/default-avatar.jpg'} alt="" width={200} height={200} className='rounded-full' />
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
                <label htmlFor="agreeToTerms">I agree to terms and conditions</label>
                {errors.agreeToTerms && <div className="text-red-500">{errors.agreeToTerms}</div>}
            </div>
            {formData.agreeToTerms && (
                <div className='flex justify-center mt-5'>
                    <Button isDisabled={!formData.agreeToTerms} onclick={handleSubmit}>Save</Button>
                </div>
            )}
        </Card>
    );
}