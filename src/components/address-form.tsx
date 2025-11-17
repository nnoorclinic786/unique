
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from './ui/dialog';

export function AddressForm({ currentAddress, onSave }: { currentAddress?: string; onSave: (newAddress: string) => void }) {
    const [address, setAddress] = useState(currentAddress || '');

    const handleSave = () => {
        onSave(address);
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="address">Full Shipping Address</Label>
                <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full shipping address, including city, state, and pincode."
                    className="min-h-[100px]"
                />
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSave}>Save Address</Button>
            </DialogFooter>
        </div>
    );
}
