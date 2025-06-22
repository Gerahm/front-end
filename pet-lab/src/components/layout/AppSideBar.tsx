import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import FilterSection from '../FilterSection';

const AppSidebar = () => {
  return (
    <Sidebar className="sticky top-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold font-heading">
            Search Filters
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <FilterSection />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
export default AppSidebar;
