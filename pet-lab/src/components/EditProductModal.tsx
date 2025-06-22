'use client';

import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product, updateProduct } from '@/lib/api';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from './ui/spinner';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

export function EditProductModal() {
  const { isEditModalOpen, closeEditModal, editingProduct } = useUiStore();
  const [productData, setProductData] = useState<Partial<Product>>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedProduct: Partial<Product>) => {
      if (!editingProduct?.id) {
        throw new Error('No product ID!');
      }
      const dataToSend = {
        ...updatedProduct,
        price: Number(updatedProduct.price) || 0,
      };
      return updateProduct(editingProduct.id, dataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product has been updated successfully.');
      closeEditModal();
    },
    onError: () => {
      toast.error('Failed to update product.');
    },
  });

  useEffect(() => {
    if (editingProduct) {
      setProductData(editingProduct);
    }
  }, [editingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubscriptionChange = (checked: boolean) => {
    setProductData(prev => ({ ...prev, subscription: checked }));
  };

  const handleSave = () => {
    mutation.mutate(productData);
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className=" text-[#283085] flex justify-center items-center text-2xl ">
            Edit Product
          </DialogTitle>
          <div className="w-full flex justify-center items-center">
            <Image
              src="/assets/images/edit-data.png"
              alt="Pet Lab Co."
              width={200}
              height={200}
            />
          </div>
        </DialogHeader>
        <fieldset disabled={mutation.isPending} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={productData.title || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={productData.price || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor" className="text-right">
              Vendor
            </Label>
            <Input
              id="vendor"
              name="vendor"
              value={productData.vendor || ''}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription" className="text-right">
              Subscription
            </Label>
            <Switch
              id="subscription"
              checked={!!productData.subscription}
              onCheckedChange={handleSubscriptionChange}
              className="col-span-3"
            />
          </div>
        </fieldset>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="success"
            className="cursor-pointer"
            type="button"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner size="sm" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
