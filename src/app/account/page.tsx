

'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddressForm } from '@/components/address-form';
import type { Address, Buyer } from '@/lib/types';
import { Home, Trash2, Edit, PlusCircle, Star, Building } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BuyerProfileForm } from '@/components/buyer-profile-form';


const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pending': 'secondary',
    'Processing': 'outline',
    'Shipped': 'default',
    'Delivered': 'default',
    'Cancelled': 'destructive',
};

export default function AccountPage() {
  const { 
    orders, updateOrderStatus, buyers, 
    addBuyerAddress, updateBuyerAddress, deleteBuyerAddress, setBuyerDefaultAddress,
    updateBuyerDetails
  } = useAppContext();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);
  const [isAddressDialogOpen, setAddressDialogOpen] = useState(false);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  
  const [buyer, setBuyer] = useState<Buyer | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName);
    if (storedUserName) {
      setBuyer(buyers.find(b => b.name === storedUserName) || null);
    }
  }, [buyers, userName]);

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'Cancelled');
    toast({
        title: "Order Cancelled",
        description: `Order ${orderId} has been cancelled.`,
    });
  };
  
  const userOrders = userName ? orders.filter(order => order.buyerName === userName) : [];

  const handleAddressSave = (addressData: Omit<Address, 'id'>) => {
    if (buyer) {
      if (editingAddress) {
        // Update existing address
        updateBuyerAddress(buyer.id, { ...editingAddress, ...addressData });
        toast({ title: "Address Updated", description: "Your address has been successfully updated." });
      } else {
        // Add new address
        addBuyerAddress(buyer.id, addressData);
        toast({ title: "Address Added", description: "Your new address has been saved." });
      }
      setAddressDialogOpen(false);
      setEditingAddress(undefined);
    } else {
       toast({
          variant: "destructive",
          title: "Error",
          description: "Could not find user to update address.",
      });
    }
  };

  const handleProfileSave = (profileData: any) => {
    if (buyer) {
        updateBuyerDetails(buyer.id, profileData);
        if (buyer.name !== profileData.name) {
            localStorage.setItem('userName', profileData.name);
            setUserName(profileData.name);
        }
        toast({ title: "Profile Updated", description: "Your account details have been updated."});
        setProfileDialogOpen(false);
    }
  };

  const openAddDialog = () => {
    setEditingAddress(undefined);
    setAddressDialogOpen(true);
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setAddressDialogOpen(true);
  }

  const handleDeleteAddress = (addressId: string) => {
    if (buyer) {
      deleteBuyerAddress(buyer.id, addressId);
      toast({ title: "Address Deleted", description: "The address has been removed." });
    }
  }

  const handleSetDefault = (addressId: string) => {
    if (buyer) {
      setBuyerDefaultAddress(buyer.id, addressId);
      toast({ title: "Default Address Set", description: "This is now your primary shipping address."});
    }
  }


  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-headline font-bold mb-8">My Account</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">{buyer?.name || 'User'}</CardTitle>
                 <Button variant="outline" size="sm" onClick={() => setProfileDialogOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold">Contact Person</h3>
                  <p className="text-muted-foreground">{buyer?.personName}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">{buyer?.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Mobile</h3>
                  <p className="text-muted-foreground">{buyer?.mobileNumber1}</p>
                </div>
                <div>
                  <h3 className="font-semibold">GST Number</h3>
                  <p className="text-muted-foreground">{buyer?.gstNumber}</p>
                </div>
                 <div className="pt-4 border-t">
                    <h3 className="font-semibold flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" />Permanent Address</h3>
                    <p className="text-muted-foreground pl-6">{buyer?.permanentAddress}</p>
                 </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Shipping Addresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {buyer?.addresses && buyer.addresses.length > 0 ? (
                        buyer.addresses.map((addr, index) => (
                            <div key={addr.id} className="p-4 border rounded-lg relative group">
                                <div className="flex items-start gap-4">
                                  <span className="font-bold text-lg text-muted-foreground pt-0.5">{index + 1}.</span>
                                  <div className="flex-1">
                                    <div className="flex items-start gap-2">
                                      {buyer.defaultAddressId === addr.id && <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-1" />}
                                      <p className="font-semibold">{addr.name}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{addr.fullAddress}</p>
                                  </div>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(addr)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" disabled={buyer.defaultAddressId === addr.id}><Trash2 className="h-4 w-4" /></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete this address. You cannot undo this action.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteAddress(addr.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                {buyer.defaultAddressId !== addr.id && (
                                    <Button variant="link" size="sm" className="p-0 h-auto mt-2" onClick={() => handleSetDefault(addr.id)}>Set as default</Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">You have not added any shipping addresses yet.</p>
                    )}
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button variant="outline" className="w-full" onClick={openAddDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Address
                    </Button>
                </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-headline font-bold mb-4">Order History</h2>
            <Card>
              <CardContent className="p-0">
                {userOrders.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                    {userOrders.map(order => (
                        <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger className="px-6">
                            <div className="flex justify-between w-full pr-4">
                            <div className="text-left">
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                                <Badge variant={statusColors[order.status] || 'secondary'} className="mt-1">{order.status}</Badge>
                            </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-4">
                            <p>This order contained {order.itemCount} items. The payment method was Cash on Delivery. Order status is currently <span className="font-semibold">{order.status}</span>.</p>
                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelOrder(order.id)}
                                >
                                    Cancel Order
                                </Button>
                            )}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                ) : (
                    <div className="text-center p-8 text-muted-foreground">
                        You have not placed any orders yet.
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

       {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setAddressDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}</DialogTitle>
                </DialogHeader>
                <AddressForm
                  address={editingAddress}
                  onSave={handleAddressSave}
                  onCancel={() => {
                    setAddressDialogOpen(false);
                    setEditingAddress(undefined);
                  }}
                />
            </DialogContent>
        </Dialog>
        
        {/* Profile Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <CardDescription>Make changes to your account details here.</CardDescription>
                </DialogHeader>
                <BuyerProfileForm
                    buyer={buyer}
                    onSave={handleProfileSave}
                    onCancel={() => setProfileDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </>
  );
}
