'use client';

import { useState } from 'react';
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
import { Product, createProduct } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from './ui/spinner';
import { Switch } from './ui/switch';
import Image from 'next/image';
import { toast } from 'sonner';
import { isValidImageUrl } from '@/lib/utils';

const initialState: Omit<Product, 'id'> = {
  title: '',
  price: 0,
  vendor: '',
  subscription: false,
  image: '',
  tags: [],
};

export function CreateProductModal() {
  const { isCreateModalOpen, closeCreateModal } = useUiStore();
  const [productData, setProductData] = useState(initialState);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newProduct: Partial<Omit<Product, 'id'>>) => {
      const dataToSend = {
        ...initialState,
        ...newProduct,
        price: Number(newProduct.price) || 0,
      };
      return createProduct(dataToSend as Omit<Product, 'id'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product has been created successfully.');
      closeCreateModal();
      setProductData(initialState);
    },
    onError: () => {
      toast.error('Failed to create product.');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProductData(prev => ({
      ...prev,
      tags: value.split(',').map(tag => tag.trim()),
    }));
  };

  const handleSubscriptionChange = (checked: boolean) => {
    setProductData(prev => ({ ...prev, subscription: checked }));
  };

  const handleSave = () => {
    if (productData.image && !isValidImageUrl(productData.image)) {
      toast.error('Invalid Image URL', {
        description: 'Please provide a valid web URL or leave the field empty.',
      });
      return;
    }
    mutation.mutate(productData);
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#283085] flex justify-center items-center text-2xl  ">
            Create New Product
          </DialogTitle>
          <div className="w-full flex justify-center items-center">
            <Image
              src="/assets/images/create-new-product.png"
              alt="Create Product"
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
              value={productData.title}
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
              value={productData.vendor}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input
              id="image"
              name="image"
              value={productData.image}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              name="tags"
              value={productData.tags.join(', ')}
              onChange={handleTagsChange}
              className="col-span-3"
              placeholder="tag1, tag2, ..."
            />
          </div>
          {/* Subscription */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscription" className="text-right">
              Subscription
            </Label>
            <Switch
              id="subscription"
              checked={productData.subscription}
              onCheckedChange={handleSubscriptionChange}
            />
          </div>
        </fieldset>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="success"
            type="button"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Spinner size="sm" /> : 'Create '}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
