'use client';
import { useCallback, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { Switch } from './ui/switch';
import NumberStepper from './NumberStepper';
import { useDebounce } from '@/hooks/use-debounce';
import { useUiStore } from '@/store/ui-store';

const FilterSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFetching = useUiStore(state => state.isFetching);

  const [tags, setTags] = useState(searchParams.get('tags') || '');
  const [isSubscribed, setIsSubscribed] = useState(
    searchParams.get('subscription') === 'true'
  );
  const [price, setPrice] = useState(searchParams.get('price') || undefined);

  useEffect(() => {
    setTags(searchParams.get('tags') || '');
    setIsSubscribed(searchParams.get('subscription') === 'true');
    setPrice(searchParams.get('price') || undefined);
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const debouncedRouterPush = useDebounce((params: string) => {
    router.push(`${pathname}?${params}`);
  }, 500);

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = event.target.value;
    setTags(newTags);
    debouncedRouterPush(createQueryString('tags', newTags));
  };

  const handleSubscriptionChange = (checked: boolean) => {
    setIsSubscribed(checked);
    router.push(
      `${pathname}?${createQueryString('subscription', checked ? 'true' : null)}`
    );
  };

  const handlePriceChange = (value: number | undefined) => {
    let processedValue = value;
    if (value !== undefined) {
      const decimalPart = value - Math.floor(value);
      if (decimalPart >= 0.9) {
        processedValue = Math.ceil(value);
      }
    }
    setPrice(
      processedValue !== undefined ? processedValue.toString() : undefined
    );
    debouncedRouterPush(
      createQueryString(
        'price',
        processedValue !== undefined ? processedValue.toString() : null
      )
    );
  };

  return (
    <>
      <fieldset disabled={isFetching} className="space-y-4">
        <SidebarMenuItem key="tags" className="w-full mt-5">
          <SidebarMenuButton asChild>
            <Input
              type="text"
              placeholder="Search Tags"
              value={tags}
              onChange={handleTagsChange}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem key="subscription" className="mt-5">
          <SidebarMenuButton asChild>
            <div className="flex items-center gap-2">
              <span>Subscription</span>
              <Switch
                className="cursor-pointer"
                checked={isSubscribed}
                onCheckedChange={handleSubscriptionChange}
              />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem key="price" className="mt-5">
          <SidebarMenuButton asChild>
            <div className="flex items-center h-[40px] gap-2">
              <span>Price</span>
              <NumberStepper value={price} onChange={handlePriceChange} />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </fieldset>
    </>
  );
};

export default FilterSection;
