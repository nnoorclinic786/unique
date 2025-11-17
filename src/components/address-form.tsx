

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import type { Address } from '@/lib/types';

interface AddressFormProps {
    address?: Omit<Address, 'id'> | Address;
    onSave: (address: Omit<Address, 'id'>) => void;
    onCancel: () => void;
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
    const [name, setName] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    
    useEffect(() => {
        if (address) {
            setName(address.name);
            setFullAddress(address.fullAddress);
        } else {
            setName('');
            setFullAddress('');
        }
    }, [address]);

    const handleSave = () => {
        if (name && fullAddress) {
            onSave({ name, fullAddress });
        }
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="address-name">Address Label</Label>
                <Input
                    id="address-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='e.g., "Main Clinic", "Home"'
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="address">Full Shipping Address</Label>
                <Textarea
                    id="address"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Enter your full shipping address, including city, state, and pincode."
                    className="min-h-[100px]"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" onClick={handleSave}>Save Address</Button>
            </DialogFooter>
        </div>
    );
}
